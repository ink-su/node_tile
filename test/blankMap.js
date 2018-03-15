'use strict';

const mapnik = require('mapnik');
const http = require('http');


// Serve a blank tile. This can indicate the absolute fastest mapnik can return a tile
// and highlights zlib/inflate bottleneck (compare "png" format to "png8")
//
// expected output: https://github.com/mapnik/node-mapnik-sample-code/blob/master/outputs/image-blank.png
const port = 8000;

const im = new mapnik.Image(256, 256);
im.background = new mapnik.Color('steelblue');

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'image/png' });
  im.encode('png8:z=1', (err, buffer) => {
    res.end(buffer);
  });
}).listen(port);

console.log(`server running on port ${port}`);
