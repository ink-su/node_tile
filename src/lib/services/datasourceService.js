'use strict';

const mapnik = require('mapnik');

const datasource = mapnik({
  type: 'shape',
  file: '../../test/mapdata/world_merc',
});

const featureset = datasource.featureset();

const memDatasource = new mapnik.MemoryDatasource({
  extent: '-20037508.342789,-8283343.693883,20037508.342789,18365151.363070',
});

// build up memory datasource
let feat = featureset.next(true);
while (feat) {
  const e = feat.extent();
  // center longitude of polygon bbox
  const x = (e[0] + e[2]) / 2;
  // center latitude of polygon bbox
  const y = (e[1] + e[3]) / 2;
  const attr = feat.attributes();
  memDatasource.add({ x, y, properties: { feat_id: feat.id(), NAME: attr.NAME, POP2005: attr.POP2005 } });
  feat = featureset.next(true);
}

module.exports = memDatasource;
