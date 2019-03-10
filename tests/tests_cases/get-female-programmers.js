'use strict';

const co = require('co');
const expect = require('chai').expect;
const init = require('../steps/init').init;
const when = require('../steps/when');

describe(`When we invoke the GET /femaleprogrammers endpoint`, co.wrap(function* () {
  before(co.wrap(function* () {
    yield init();
  }));

  it(`Should return an array of 2 GREAT female programmers`, co.wrap(function* () {
    let res = yield when.we_invoke_get_famale_programmers();

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.lengthOf(2);

    for (let programmer of res.body) {
      expect(programmer).to.have.property('name');
      expect(programmer).to.have.property('description');
      expect(programmer).to.have.property('image');
    }
  }));
}));