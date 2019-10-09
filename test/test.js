const expect = require('chai').expect;
const server = require('../web/basic-server.js');
const fs = require('fs');
const archive = require('../helpers/archive-helpers');
const path = require('path');
const supertest = require('supertest');
const initialize = require('../web/initialize.js');

initialize(path.join(__dirname, '/testdata'));

archive.initialize({
  archivedSites: path.join(__dirname, '/testdata/sites'),
  list: path.join(__dirname, '/testdata/sites.txt'),
});

const request = supertest.agent(server);

describe('server', function() {
  describe('GET /', function() {
    it('should return the content of index.html', function(done) {
      // just assume that if it contains an <input> tag its index.html
      request
        .get('/')
        .expect(200, /<input/, done);
    });
  });

  describe('archived websites', function() {
    describe('GET', function() {
      it('should return the content of a website from the archive', function(done) {
        const fixtureName = 'www.google.com';
        const fixturePath = archive.paths.archivedSites + '/' + fixtureName;

        // Create or clear the file.
        const fd = fs.openSync(fixturePath, 'w');
        fs.writeSync(fd, 'google');
        fs.closeSync(fd);

        // Write data to the file.
        fs.writeFileSync(fixturePath, 'google');

        request
          .get('/' + fixtureName)
          .expect(200, /google/, function(err) {
            fs.unlinkSync(fixturePath);
            done(err);
          });
      });

      it('Should 404 when asked for a nonexistent file', function(done) {
        request.get('/arglebargle').expect(404, done);
      });
    });

    describe('POST', function() {
      it('should append submitted sites to \'sites.txt\'', function(done) {
        const url = 'www.example.com';

        // Reset the test file and process request
        fs.closeSync(fs.openSync(archive.paths.list, 'w'));

        request
          .post('/')
          .type('form')
          .send({ url: url })
          .expect(302, function(err) {
            if (!err) {
              const fileContents = fs.readFileSync(archive.paths.list, 'utf8');
              expect(fileContents).to.equal(url + '\n');
            }

            done(err);
          });
      });
    });
  });
});

describe('archive helpers', function() {
  describe('#readListOfUrls', function() {
    it('should read urls from sites.txt', function(done) {
      const urlArray = ['example1.com', 'example2.com'];
      fs.writeFileSync(archive.paths.list, urlArray.join('\n'));

      archive.readListOfUrls((err, urls) => {
        expect(urls).to.deep.equal(urlArray);
        done();
      });
    });
  });

  describe('#isUrlInList', function() {
    it('should check if a url is in the list', function(done) {
      const urlArray = ['example1.com', 'example2.com'];
      fs.writeFileSync(archive.paths.list, urlArray.join('\n'));

      let counter = 0;
      const total = 2;

      archive.isUrlInList('example1.com', (err, exists) => {
        expect(exists).to.be.true;
        if (++counter === total) { done(); }
      });

      archive.isUrlInList('gibberish', (err, exists) => {
        expect(exists).to.be.false;
        if (++counter === total) { done(); }
      });
    });
  });

  describe('#addUrlToList', function() {
    it('should add a url to the list', function(done) {
      const urlArray = ['example1.com', 'example2.com\n'];
      fs.writeFileSync(archive.paths.list, urlArray.join('\n'));

      archive.addUrlToList('someurl.com', () => {
        archive.isUrlInList('someurl.com', (err, exists) => {
          expect(exists).to.be.true;
          done();
        });
      });
    });
  });

  describe('#isUrlArchived', function() {
    it('should check if a url is archived', function(done) {
      fs.writeFileSync(archive.paths.archivedSites + '/www.example.com', 'blah blah');

      let counter = 0;
      const total = 2;

      archive.isUrlArchived('www.example.com', (err, exists) => {
        expect(exists).to.be.true;
        if (++counter === total) { done(); }
      });

      archive.isUrlArchived('www.abc.com', (err, exists) => {
        expect(exists).to.be.false;
        if (++counter === total) { done(); }
      });
    });
  });

  describe('#downloadUrls', function() {
    it('should download all pending urls in the list', function(done) {
      const urlArray = ['www.example.com', 'www.google.com'];
      archive.downloadUrls(urlArray);

      // Ugly hack to wait for all downloads to finish.
      setTimeout(() => {
        expect(fs.readdirSync(archive.paths.archivedSites)).to.deep.equal(urlArray);
        done();
      }, 500);
    });
  });
});

