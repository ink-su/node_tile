'use strict';

const nconf = require('nconf');
const bluebird = require('bluebird');
const mapnik = bluebird.promisifyAll(require('mapnik'));
const mercatorUtils = require('./mercatorUtils');
const datasource = require('./datasourceService');
/* eslint no-bitwise: 0 */

// register fonts and datasource plugins
mapnik.register_default_fonts();
// Register input formats: TODO: in production choose a single one
// https://github.com/mapnik/node-mapnik/blob/b277f6580876adf6e0a7f579627efe1e082a54e9/src/mapnik_plugins.hpp
mapnik.register_default_input_plugins();

// configuration
const METATILE = nconf.get('renderd:metatile');
const TILEPATH = nconf.get('renderd:tilepath');
const MAPGROUP = nconf.get('renderd:mapgroup');

const stylesheet = nconf.get('renderd:stylesheet');

const mask = ~(METATILE - 1);

function splitImage(image, size, format = 'png256') {
  const tiles = [];
  const requiredTiles = [];
  for (let x = 0; x < size; x += 1) {
    tiles[x] = [];
    for (let y = 0; y < size; y += 1) {
      requiredTiles.push([x, y]);
    }
  }
  return bluebird.map(requiredTiles, xy =>
    image.view(xy[0] * 256, xy[1] * 256, 256, 256)
      .encode(format)
      .then((encoded) => {
        tiles[xy[0]][xy[0]] = encoded;
      }))
    .return(tiles);
}

function renderTile(boundingBox, size) {
  const layer = new mapnik.Layer(MAPGROUP, mercatorUtils.proj4);
  layer.datasource = datasource;
  layer.styles = ['points'];
  const mapnikMap = new mapnik.Map(256, 256, mercatorUtils.proj4);
  mapnikMap.bufferSize = 128;
  return mapnikMap.load(stylesheet, { strict: true })
    .then((map) => {
      map.add_layer(layer);
      map.extent = boundingBox;
      const image = new mapnik.Image(map.width * size, map.height * size);
      return map.render(image);
    })
    .then(image => splitImage(image))
    .catch((err) => {
      console.log(err);
      throw err;
    });
}

function getFileName(x, y, z) {
  const hash = [];
  let xBit = x & mask;
  let yBit = y & mask;
  for (let i = 0; i < 5; i += 1) {
    hash[i] = ((xBit & 0x0f) << 4) | (yBit & 0x0f);
    xBit >>= 4;
    yBit >>= 4;
  }
  return `${TILEPATH}/${MAPGROUP}/${z}/${hash[4]}/${hash[3]}/${hash[2]}/${hash[1]}/${hash[0]}.meta`;
}


const renderService = {
  renderTile,
  getFileName,
  getTileSize: z => Math.min(METATILE, 1 << z),
};
module.exports = renderService;
