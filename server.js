const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');

var app = express();

const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/www.unitedin.kr/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/www.unitedin.kr/fullchain.pem')
};


app.get('/', function (req, res) {
  res.send('Hello World3000!');
});

app.get('/insecure', function (req, res) {
  res.send('Dangerous!');
});

http.createServer(app).listen(80, function () {
  console.log('Example app listening on port 3000!');
});
https.createServer(options,app).listen(443, function () {
  console.log('Example app listening on port 3001!');
});
