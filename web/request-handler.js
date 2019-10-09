const path = require('path');
const archive = require('../helpers/archive-helpers');
// require more modules/folders here!
const helpers = require('./http-helpers'); // require http-helps to use serverAssets
const querystring = require('querystring');

exports.handleRequest = (req, res) => {
  console.log('Serving request type ' + req.method + ' for url ' + req.url);
  //res.end(archive.path.list);
  if(req.method === 'GET'){
    if(req.url === '/'){
      helpers.serveAssets(res, path.join(archive.paths.siteAssets, '/index.html'));
    } else {
      archive.isUrlArchived(path.basename(req.url), function(bool){
        if(bool){
          helpers.serveAssets(res, path.join(archive.paths.archivedSites, req.url));
        } else {
          res.writeHead(404, helpers.headers);
          res.end();
        }
      })
    }
  }

};
// server:
// GET /
//   1) should return the content of index.html
// archived websites:
// GET
// 2) should return the content of a website from the archive
// 3) Should 404 when asked for a nonexistent file
// POST
// 4) should append submitted sites to 'sites.txt'
// when user submits page
// GET request?
// tell server to check if URL in GET exists
// if we do take to archived page
// if not display `loading` and archive it