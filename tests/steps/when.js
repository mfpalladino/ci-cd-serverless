'use strict';

const APP_ROOT = '../..';
const _ = require('lodash');
const co = require('co');
const http = require('superagent-promise')(require('superagent'), Promise);
const URL = require('url');
const mode = process.env.TEST_MODE;

let respondFrom = function (httpRes) {
  let contentType = _.get(httpRes, 'headers.content-type', 'application/json');
  let body =
    contentType === 'application/json' ?
    httpRes.body :
    httpRes.text;

  return {
    statusCode: httpRes.status,
    body: body,
    headers: httpRes.headers
  };
}

function viaHandler(event, functionName) {

  let handler = require(`${APP_ROOT}/functions/${functionName}`).handler;
  console.log(`invoking via HANDLER ${functionName}`);

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

let viaHttp = co.wrap(function* (relPath, method, opts) {
  let root = process.env.TEST_ROOT;
  let url = `${root}/${relPath}`;
  console.log(`invoking via HTTP ${method} ${url}`);

  try {
    let httpReq = http(method, url);

    let body = _.get(opts, "body");
    if (body) {
      httpReq.send(body);
    }

    let res = yield httpReq;
    return respondFrom(res);
  } catch (err) {
    if (err.status) {
      return {
        statusCode: err.status,
        headers: err.response.headers
      };
    } else {
      throw err;
    }
  }
});

let we_invoke_get_index = co.wrap(function* () {
  let res =
    mode === 'handler' ?
    yield viaHandler({}, 'get-index'): yield viaHttp('', 'GET');

  return res;
});

let we_invoke_get_famale_programmers = co.wrap(function* () {
  let res =
    mode === 'handler' ?
    yield viaHandler({}, 'get-female-programmers'): yield viaHttp('femaleprogrammers', 'GET', {
      iam_auth: false
    });

  return res;
});

module.exports = {
  we_invoke_get_index,
  we_invoke_get_famale_programmers
}