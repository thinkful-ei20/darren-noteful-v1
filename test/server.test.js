'use strict';

const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;

chai.use(chaiHttp);



describe('Reality Check', function() {
  it('true should be true', function () {
    expect(true).to.be.true;
  });

  it('2 + 2 should equal 4', function(){
    expect(2 + 2).to.equal(4);
  });

});

describe('Express static', function () {

  it('GET request "/" should return the index page', function () {
    return chai.request(app)
      .get('/')
      .then(function (res) {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.be.html;
      });
  });

});

describe('404 handler', function () {

  it('should respond with 404 when given a bad path', function () {
    return chai.request(app)
      .get('/DOES/NOT/EXIST')
      .then(res => {
        expect(res).to.have.status(404);
      });
  });

});

describe('GET api/notes/:id',function(){

  it('should return correct note obj w/ id, title, and content for given id', function(){
    return chai.request(app)
      .get('/api/notes/1001')
      .then(res => {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
      });
  });
  it('should respond with a 404 for an invalid id',function(){
    return chai.request(app)
      .get('/api/notes/9999')
      .then( res => {
        expect(res).to.have.status(404);
      });
  });

});
