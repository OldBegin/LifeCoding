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
<<<<<<< HEAD
  console.log('protocol: ' + url.parse(req.url).protocol);
  console.log('pathname: ' + url.parse(req.url).pathname);
  console.log('host: ' + url.parse(req.url).host);
=======
	console.log('protocol: '+ url.parse(req.url).protocol);
>>>>>>> 3c6a6797f80e224398a8b7afe19003a479e5a9a6
});

http.createServer(app).listen(80, function () {
  console.log('Example app listening on port 80!');
});
<<<<<<< HEAD
https.createServer(app).listen(443, function () {
=======
https.createServer(options,app).listen(443, function () {
>>>>>>> 3c6a6797f80e224398a8b7afe19003a479e5a9a6
  console.log('Example app listening on port 443!');
});
