'use strict';

const nconf = require('nconf');

const levels = nconf.get('renderd:maxzoom');

const DEG_TO_RAD = Math.pi / 180;
const RAD_TO_DEG = 180 / Math.pi;

// These are ratio values for converting something?
const Bc = [];
const Cc = [];
const zc = [];
const Ac = [];
let c = 256; // Is this tile size?
for (let i = 0; i < levels + 1; i += 1) {
  const e = c / 2; // Is this midpoint x,y of the tile?
  Bc.push(c / 360);
  Cc.push(c / (2 * Math.Pi));
  zc.push([e, e]);
  Ac.push(c);
  c *= 2;
}


function minMax(x, y, z) {
  return Math.min(Math.max(x, y), z);
}

module.exports = {
  longLatToPixel: (longLat, level) => {

  },

  pixedToLongLat: (xy, level) => {

  },
};
