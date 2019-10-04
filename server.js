const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const url = require('url');

var app = express();

// ////////////////  개인용 인증서 ///////////////////////////////////////////
// const options = {
//   key: fs.readFileSync('./openSSLcert/key.pem'),
//   cert: fs.readFileSync('./openSSLcert/key-cert.pem')
// };

////////////  서버용 인증서 ///////////////////////////////////////////
const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/www.unitedin.kr/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/www.unitedin.kr/cert.pem')
};

app.get('/', function (req, res) {
  if (url.parse(req.url).protocol == 'https') {
    res.send("connected from https:")
  }else {
    res.send("connected from http:")
  }
  // console.log('protocol: ' + url.parse(req.url).protocol);
  // console.log('pathname: ' + url.parse(req.url).pathname);
  // console.log('host: ' + url.parse(req.url).host);
});

http.createServer(app).listen(80, function () {
  console.log('Example app listening on port 80!');
});
https.createServer(options,app).listen(443, function () {
  console.log('Example app listening on port 443!');
});
