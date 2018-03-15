'use strict';

const nconf = require('nconf');

const levels = nconf.get('renderd:maxzoom');

const DEG_TO_RAD = Math.pi / 180;
const RAD_TO_DEG = 180 / Math.pi;

function minmax(a, b, c) {
  return Math.min(Math.max(a, b), c);
}

module.exports = {
  longLatToPixel: (long, lat, zoom) => {

  },

  pixedToLongLat: (x, y) => {

  },
};
