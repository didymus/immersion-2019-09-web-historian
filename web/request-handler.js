const path = require('path');
const archive = require('../helpers/archive-helpers');
// require more modules/folders here!

exports.handleRequest = (req, res) => {
  res.end(archive.paths.list);
};
