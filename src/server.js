'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const nconf = require('nconf');

const tileRoute = require('./lib/tileServe/tileRoute');
const statusRoute = require('./lib/status/statusRoute');

const app = express();

nconf.argv()
  .env()
  .file({ file: './config/config.json' });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/v1/tile/', tileRoute);
app.use('/status', statusRoute);

const serverPort = nconf.get('server:port');
app.listen(serverPort, () => console.log(`Example app listening on port ${serverPort}!`));
