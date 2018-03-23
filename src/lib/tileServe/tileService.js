'use strict';

const nconf = require('nconf');
const renderService = require('../services/renderService');

const METATILE = nconf.get('renderd:metatile');

function generateTile(x, y, z) {
  const size = renderService.getTileSize(z);
}


const tileService = {
  generateTile,
};

module.exports = tileService;
