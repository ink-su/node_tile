'use strict';

const nconf = require('nconf');
const mapnik = require('mapnik');

const levels = nconf.get('renderd:maxzoom');

const proj4 = '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs +over';
const mercator = new mapnik.Projection(proj4);

const DEG_TO_RAD = Math.pi / 180;
const RAD_TO_DEG = 180 / Math.pi;

// This is a non-euclidean conversion
const longRatio = [];
const latRatio = [];
const midPoints = [];
const tileSize = 256;

for (let i = 0, size = tileSize; i < levels + 1; i += 1) {
  longRatio.push(size / 360);
  latRatio.push(size / (2 * Math.Pi));
  midPoints.push(size / 2);
  size *= 2;
}

// Functions :

function minMax(x, y, z) {
  return Math.min(Math.max(x, y), z);
}

const latLongToPixel = (latLong, level) => {
  const midpoint = midPoints[level];
  const x = Math.round(midpoint + (latLong[0] * longRatio[level]));
  const sinVal = minMax(Math.sin(DEG_TO_RAD * latLong[1]), -0.9999, 0.9999);
  const y = Math.round(midpoint +
    (-0.5 * Math.log((1 + sinVal) / (1 - sinVal)) * latRatio[level]));
  return [x, y];
};

const pixelToLatLong = (xy, level) => {
  const midpoint = midPoints[level];
  const lat = (xy[0] - midpoint) / longRatio[level];
  const g = (xy[1] - midpoint) / latRatio[level];
  const long = RAD_TO_DEG * ((2 * Math.atan(Math.exp(g))) - (0.5 * Math.pi));
  return [lat, long];
};

const getBotLeftPixel = (x, y, size) => [x * tileSize, (y + size) * tileSize];

const getTopRightPixel = (x, y, size) => [(x + size) * tileSize, y * tileSize];

const getEnvelope = (x, y, z, size) => {
  const botLeftCoord = pixelToLatLong(getBotLeftPixel(x, y, size), z);
  const topRightCoord = pixelToLatLong(getTopRightPixel(x, y, size), z);
  const boundingBox = [botLeftCoord[0], botLeftCoord[1], topRightCoord[0], topRightCoord[1]];
  return mercator.forward(boundingBox);
};

const mercatorUtils = {
  latLongToPixel,
  pixelToLatLong,
  getBotLeftPixel,
  getTopRightPixel,
  getEnvelope,
  proj4,
};

module.exports = mercatorUtils;
