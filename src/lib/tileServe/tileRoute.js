'use strict';

const express = require('express');

const tileService = require('./tileService');

const router = express.Router();

router.get('/:z/:x/:y', (req, res) => {
  const { x, y, z } = req.params;
  tileService.generateTile(x, y, z)
    .then((resp) => {
      res.send(resp);
    });
});

router.delete('/:z/:x/:y', (req, res) => {
  const { x, y, z } = req.params;
  tileService.expireTile(x, y, z)
    .then((resp) => {
      res.send(resp);
    });
});

module.exports = router;
