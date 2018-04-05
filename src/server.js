'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const nconf = require('nconf');

nconf.argv()
  .env()
  .file({ file: './config/config.json' });


const tileRoute = require('./lib/tileServe/tileRoute');
const statusRoute = require('./lib/status/statusRoute');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/v1/tile/', tileRoute);
app.use('/status', statusRoute);

const serverPort = nconf.get('server:port');
app.listen(serverPort, () => console.log(`Example app listening on port ${serverPort}!`));
