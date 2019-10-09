// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
let archive = require('..helpers/archive-helpers');
let cron = require('node-cron');

cron.schedule('', function(){
    console.log()
}) // check if urlIsArchived and downloadUrl?

