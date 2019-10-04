const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const url = require('url');

var app = express();

const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/www.unitedin.kr/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/www.unitedin.kr/fullchain.pem')
};

app.get('/', function (req, res) {
  if (url.parse(req.url).protocol == 'https:') {
    res.send("connected from https:")
  }else {
    res.send("connected from http:")
  }
});

app.get('/insecure', function (req, res) {
  res.send('Dangerous!');
});

http.createServer(app).listen(80, function () {
  console.log('Example app listening on port 80!');
});
https.createServer(options,app).listen(443, function () {
  console.log('Example app listening on port 443!');
});
