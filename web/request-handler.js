const path = require('path');
const archive = require('../helpers/archive-helpers');
// require more modules/folders here!
const helpers = require('./http-helpers'); // require http-helpers to use serverAssets
const querystring = require('querystring');

exports.handleRequest = (req, res) => {
  if(req.method === 'GET'){
    if(req.url === '/'){
      helpers.serveAssets(res, path.join(archive.paths.siteAssets, '/index.html'));
    } else {
      // if there is a file where name === url
      archive.isUrlArchived(path.basename(req.url), (err, bool) => {
          if(bool){
          helpers.serveAssets(res, path.join(archive.paths.archivedSites, req.url));
        } else {
          // else write 404 status code to appropriate headers
          res.writeHead(404, helpers.headers);
          res.end();
        }
      });
    }
  } else if(req.method === 'POST'){
    let body = '';
    req.on('data', (chonk) => {
      body += chonk;
    });
    req.on('end', () => {
      // make sure node `querystring` module is required
      let url = querystring.parse(body).url;
      // if archived, serve asset
      archive.isUrlArchived(url, (bool) => {
        if(bool){
          helpers.serveAssets(res, path.join(archive.paths.archivedSites, '/', url));
        } else { // if not archived
          archive.isUrlInList(url, (bool) => { // see if it is in list
            if(!bool){
              // add url to list and redirect them to loading.html
              archive.addUrlToList(url, () => {
                res.writeHead(302, helpers.headers); // write head
                helpers.serveAssets(res, path.join(archive.paths.siteAssets, '/loading.html'));
              });
            }
          });
        }
      });
    });
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