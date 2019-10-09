// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
const archive = require('..helpers/archive-helpers');
const cron = require('node-cron');

cron.schedule('*/1 * * * *', function(){
    console.log('Running every minute');
    archive.readListOfUrls(archive.downloadUrls);
});


