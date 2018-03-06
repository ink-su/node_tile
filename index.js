'use-strict';

const express = require('express');
const tileService = require('./lib/tileService');

const app = express();

app.get('/status', (req, res) => {
  res.send('It\'s working');
});

app.get('/tile/:z/:x/:y', (req, res) => {
  const { x, y, z } = req.params;
  tileService.generateTile(x, y, z)
    .then((resp) => {
      res.send(resp);
    })
    .catch((resp) => {
      res.send(resp);
    });
});

app.delete('/tile/:z/:x/:y', (req, res) => {
  const { x, y, z } = req.params;
  tileService.expireTile(x, y, z)
    .then((resp) => {
      res.send(resp);
    })
    .catch((resp) => {
      res.send(resp);
    });
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));
