'use strict';

const nconf = require('nconf');
/* eslint no-bitwise: 0 */
const METATILE = nconf.get('renderd:metatile');
const TILEPATH = nconf.get('renderd:tilepath');
const MAPGROUP = nconf.get('renderd:mapgroup');

const mask = ~(METATILE - 1);
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

const renderd = {
  getFileName,
};
module.exports = renderd;
