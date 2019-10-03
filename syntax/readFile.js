const fs = require('fs');

fs.readFile('./data/css', 'utf8', function(err,data){
  console.log(data);
});
