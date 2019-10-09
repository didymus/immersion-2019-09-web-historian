// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
let archive = require('..helpers/archive-helpers');
let cron = require('node-cron');

cron.schedule('*/1 * * * *', function(){
    console.log('Running a task every minute.');
    archive.readListOfUrls(archive.downloadUrls);
});


