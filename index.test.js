// Copyright (c)2023 Quinn Michaels
// Github Deva test file

const {expect} = require('chai')
const :key: = require('./index.js');

describe(github.me.name, () => {
  beforeEach(() => {
    return github.init()
  });
  it('Check the DEVA Object', () => {
    expect(github).to.be.an('object');
    expect(github).to.have.property('agent');
    expect(github).to.have.property('vars');
    expect(github).to.have.property('listeners');
    expect(github).to.have.property('methods');
    expect(github).to.have.property('modules');
  });
})
