const path = require('path');
const archive = require('../helpers/archive-helpers');
// require more modules/folders here!
const helpers = require('./http-helpers'); // require http-helpers to use serverAssets
const querystring = require('querystring');

exports.handleRequest = (req, res) => {
  if(req.method === 'GET'){ // deals with 'GET' requests
    if(req.url === '/'){ // if user accesses root dir then serve `index.html`
      helpers.serveAssets(res, path.join(archive.paths.siteAssets, '/index.html'));
    } else {
      // check if archived
      archive.isUrlArchived(path.basename(req.url), (err, bool) => {
          if(bool){ // if exists then serve from archive
          helpers.serveAssets(res, path.join(archive.paths.archivedSites, req.url));
        } else {
          // else write 404 status code to appropriate headers
          res.writeHead(404, helpers.headers);
          res.end();
        }
      });
    }
  } else if(req.method === 'POST'){ // deals with 'POST' requests
    let body = '';
    req.on('data', (chonk) => {
      body += chonk;
    });
    req.on('end', () => {
      // make sure node `querystring` module is required
      const url = querystring.parse(body).url;
      // if archived, serve asset
      archive.isUrlArchived(url, (bool) => {
        if(bool){
          helpers.serveAssets(res, path.join(archive.paths.archivedSites, '/', url));
        } else { // if not archived see if in list
          archive.isUrlInList(url, (bool) => { // see if it is in list
            if(!bool){
              // add url to list and redirect them to loading.html
              archive.addUrlToList(url, () => {
                res.writeHead(302, helpers.headers); // write head
                helpers.serveAssets(res, path.join(archive.paths.siteAssets, '/loading.html')); // serve `loading.html`
              });
            }
          });
        }
      });
    });
  }
};