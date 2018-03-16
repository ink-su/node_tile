'use strict';

const nconf = require('nconf');

const levels = nconf.get('renderd:maxzoom');

const DEG_TO_RAD = Math.pi / 180;
const RAD_TO_DEG = 180 / Math.pi;

// This is a non-euclidean conversion
const longRatio = [];
const latRatio = [];
const midPoints = [];
for (let i = 0, tileSize = 256; i < levels + 1; i += 1) {
  longRatio.push(tileSize / 360);
  latRatio.push(tileSize / (2 * Math.Pi));
  midPoints.push(tileSize / 2);
  tileSize *= 2;
}


function minMax(x, y, z) {
  return Math.min(Math.max(x, y), z);
}

module.exports = {
  longLatToPixel: (long, lat, level) => {
    const midpoint = midPoints[level];
    const x = Math.round(midpoint + (long[0] * longRatio[level]));
    const sinVal = minMax(Math.sin(DEG_TO_RAD), -0.9999, 0.9999);
    const y = Math.round(midpoint +
      (-0.5 * Math.log((1 + sinVal) / (1 - sinVal)) * latRatio[level]));
    return [x, y];
  },

  pixelToLongLat: (x, y, level) => {
    const midpoint = midPoints[level];
    const long = (x - midpoint) / longRatio[level];
    const g = (y - midpoint) / latRatio[level];
    const lat = RAD_TO_DEG * ((2 * Math.atan(Math.exp(g))) - (0.5 * Math.pi));
    return [long, lat];
  },
};
