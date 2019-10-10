const fs = require('fs');

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html',
};

exports.serveAssets = (res, asset, callback) => {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)
  fs.readFile(asset, 'utf8', (err, data) => {
    //console.log('data: ', data);
    if(callback){
      callback(err, data);
    }
    if(res.head !== undefined){
      res.writeHead(200, exports.headers);
    }
    res.end(data);
  });
};

// As you progress, keep thinking about what helper functions you can put here!