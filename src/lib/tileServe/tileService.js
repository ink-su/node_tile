'use strict';

const bluebird = require('bluebird');
const fs = bluebird.promisifyAll(require('fs'));

const mercatorUtils = require('../services/mercatorUtils');
const renderService = require('../services/renderService');


function saveTiles(tiles, x, y, z) {
  const writePromises = [];
  for (let px = 0; px < tiles.length; px += 1) {
    for (let py = 0; py < tiles[px].length; py += 1) {
      writePromises.push(fs.writeFileAsync(`./output/${x}-${y}-${z}-${px}-${py}.png`, tiles[px][py], 'binary'));
    }
  }
  return bluebird.all(writePromises);
}

function generateTile(x, y, z) {
  const size = renderService.getTileSize(z);
  const boundingBox = mercatorUtils.getEnvelope(x, y, z, size);
  return renderService.renderTile(boundingBox, size)
    .then(tiles => saveTiles(tiles, x, y, z));
}


const tileService = {
  generateTile,
};

module.exports = tileService;
