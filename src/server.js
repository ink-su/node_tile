'use-strict';

const express = require('express');
const bodyParser = require('body-parser');

const tileRoute = require('./lib/tileServe/tileRoute');
const statusRoute = require('./lib/status/statusRoute');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/v1/tile/', tileRoute);
app.use('/status', statusRoute);


app.listen(3000, () => console.log('Example app listening on port 3000!'));
