const _ = require('underscore');
const path = require('path');
const fs = require('fs');
const https = require('https');
//const http = require('http');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt'),
};

// Used for stubbing paths for tests, do not modify
exports.initialize = (pathsObj) => {
  _.each(pathsObj, (path, type) => {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = (callback) => {
fs.readFile(exports.paths.list, 'utf8', (err, data) => {
 //console.log('data' ,data);

 data = data.toString().split('\n');
  if(callback){
    callback(err, data);
  }
  
});
};

exports.isUrlInList = (url, callback) => {
fs.readFile(exports.paths.list, 'utf8', (err, data) => {
  if(callback){
    let urlArray = data.split('\n');
    let found = urlArray.indexOf(url) !== -1;
    callback(err, found);
  }
});
};

exports.addUrlToList = (url, callback) => {
  //console.log('callback', callback);
fs.appendFile(exports.paths.list, url + '\n', (err) => {
if(callback){
  callback(err);
}
});
};

exports.isUrlArchived = (url, callback) => {
fs.readdir(exports.paths.archivedSites, 'utf8', (err, files) => {
  let bool = files.includes(url);
  if(callback){
    callback(err, bool);
  }
});
};

// exports.downloadUrls = (urls) => {
//   // console.log(urls);
//   for (let i = 0; i < urls.length; i++) {
//     http.get('http://' + urls[i], (res) => {
//       fs.appendFile(exports.paths.archivedSites + '/' + urls[i], res.body, (err) => {
//         if (err) {
//           console.log('Error: ', err);
//         }
//       })
//     })
//   }
// };
exports.downloadUrls = (urls) => {
  // console.log(urls);
  let httpsGet = (url) => {
    fs.open(`${exports.paths.archivedSites}/${url}`, 'w', function (err, sites) {
      if (err) {
        console.log('Error: ', err);
      }
    // console.log(url);
    https.get(`https://${url}`, function(res){
      let body = '';
      res.on('data', function(chunk){
        body += chunk;
      });
      res.on('end', function(){
        fs.write(sites, body, 'utf8');
      });
    });
  });
  }
for(let i = 0; i < urls.length; i++){
  httpsGet(urls[i]);
};
};