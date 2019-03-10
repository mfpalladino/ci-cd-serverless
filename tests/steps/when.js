'use strict';

const APP_ROOT = '../..';
const _ = require('lodash');

function viaHandler(event, functionName) {

  let handler = require(`${APP_ROOT}/functions/${functionName}`).handler;

  return new Promise((resolve, reject) => {

    let context = {};
    let callback = function (err, response) {
      if (err) {
        reject(err);
      } else {
        let contentType = _.get(response, 'headers.Content-Type', 'application/json');
        if (response.body && contentType === 'application/json') {
          response.body = JSON.parse(response.body);
        }

        resolve(response);
      }
    };

    handler(event, context, callback);
  });
}

let we_invoke_get_index = () => viaHandler({}, 'get-index');

let we_invoke_get_famale_programmers = () => viaHandler({}, 'get-female-programmers');

module.exports = {
  we_invoke_get_index,
  we_invoke_get_famale_programmers
}