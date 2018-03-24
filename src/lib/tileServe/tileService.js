'use strict';

const nconf = require('nconf');
const mercatorUtils = require('../services/mercatorUtils');
const renderService = require('../services/renderService');

const METATILE = nconf.get('renderd:metatile');

function generateTile(x, y, z) {
  const size = renderService.getTileSize(z);
  const boundingBox = mercatorUtils.getEnvelope(x, y, z, size);
  return renderService.loadTile(boundingBox, size);
}


const tileService = {
  generateTile,
};

module.exports = tileService;
