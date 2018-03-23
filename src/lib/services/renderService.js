'use strict';

const nconf = require('nconf');
const bluebird = require('bluebird');
const mapnik = bluebird.promisifyAll(require('mapnik'));
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

const mask = ~(METATILE - 1);

function loadTile() {
  return new mapnik.Map(256, 256).load(nconf.get('renderd:stylesheet'))
    .then((map) => {

    })
    .catch((err) => {
      console.log(err);
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
  loadTile,
  getFileName,
  getTileSize: z => Math.min(METATILE, 1 << z),
};
module.exports = renderService;
