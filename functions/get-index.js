'use strict';

const co = require('co');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const Mustache = require('mustache');
const http = require('superagent-promise')(require('superagent'), Promise);

const femaleprogrammersApiRoot = process.env.femaleprogrammers_api;

var html;

function* loadHtml(){
  if (!html){
    html = yield fs.readFileAsync('static/index.html', 'utf-8');
  }

  return html;
}

function* getFameProgrammers(){
  return (yield http.get(femaleprogrammersApiRoot)).body;
}

module.exports.handler = co.wrap(function* (event, context, callback) {
  let template = yield loadHtml();
  let programmers = yield getFameProgrammers();
  let html = Mustache.render(template, {programmers});

  let response = {
    statusCode: 200,
    body: html,
    headers: {
      'Content-Type': 'text/html; charset=UTF-8'
    }
  };

  callback(null, response);
});
