const _ = require('underscore');
const path = require('path');
const fs = require('fs');
const https = require('https');
//const http = require('http');
//const helpers = require('../web/http-helpers');
//const request = require('request');

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
  if(err){
    throw err;
  }
  //callback(data);
  let arr = data.split('\n');
  callback(arr.slice(0, -1));
});
};

exports.isUrlInList = (url, callback) => {
fs.readFile(exports.paths.list, 'utf8', (err, data) => {
  if(err){
    throw err;
  }
  callback(data);
  if(data.indexOf(url) > 0){
    return true;
  } else {
    return false;
  }
});
};

exports.addUrlToList = (url, callback) => {
fs.appendFile(exports.path.list, url, +'\n', (err) => {
  if(err){
    throw err
  }
})
console.log(url + ' saved!');
};

exports.isUrlArchived = (url, callback) => {
fs.readFile(exports.paths.archivedSites, 'utf8', (err, data) => {
  if(err){
    throw err;
  }
  if(data.indexOf(url) > 0){
    return true;
  } else { 
    return false;
  }
});
};

exports.downloadUrls = (urls) => {
//console.log(urls);
let getRequest = function(url){
  fs.open(`${exports.paths.archivedSites}/${url}`, 'w', function(err, sites){
    if(err){
      throw err;
    }
    //console.log(url);
    https.get(`https://${url}`, function(res){
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', function(){
        fs.write(sites, body, 'utf8');
      });
    });
  });
};
for(let i = 0; i < urls.length; i++){
  getRequest(urls[i]);
}
// http.get('http://' + url, function(res){
//   helpers.getData(res, function(data){
//     fs.writeFile(path.join(exports.paths.archivedSites, url), data);
//   });
// });
};
