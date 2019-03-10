'use strict';

const co = require('co');

let initialized = false;

let init = co.wrap(function*(){
    if (initialized)
        return;

    process.env.femaleprogrammers_api = 'https://ml742am7k4.execute-api.us-east-1.amazonaws.com/dev/femaleprogrammers';

    initialized = true;
});

module.exports = {
    init
}