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

describe('GET /api/notes',function(){
  it('should return feault of 10 notes as array', function(){
    return chai.request(app)
      .get('/api/notes')
      .then(function(res) {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('array'); 
        // expect(res.body[0]).to.include.keys('id','title','content');  
        expect(res.body).to.have.length(10);
        
        const expectedNotesKeys = ['id','title','content'];
        res.body.forEach(function(note){
          expect(note).to.be.an('object');
          expect(note).to.include.keys(expectedNotesKeys);
        });

      
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
      .get('/api/notes/99999')
      .then( res => {
        expect(res).to.have.status(404);
      });
  });

});

describe('POST /api.notes',function(){

  it('should create and return new item w/ location header and notify of missing title field',function(){
    const noteTestPost = {
      title: 'Test Test',
      content: 'This is a test post body'
    };
    return chai.request(app)
      .post('/api/notes')
      .send(noteTestPost)
      .then(function(res){
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res).to.be.an('object');
        expect(res.body).to.include.keys('id', 'title', 'content');
        expect(res.body.id).to.not.equal(null);
        expect(res.body.title).to.equal(noteTestPost.title);
        expect(res.body.content).to.equal(noteTestPost.content);
        expect(res).to.have.header('location');
      });
  });

  it('should notifiy of missing title field',function(){
    const newNoteTestPost = {
      'trash': 'notValid'
    };
    return chai.request(app)
      .post('/api/notes')
      .send(newNoteTestPost)
      .catch(err => err.response)
      .then(function(res){
        expect(res).to.have.status(400);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body.message).to.equal('Missing `title` in request body');
      });
  });
});

describe('PUT /api/notes/:id',function(){

  it('should update and return note obj with PUT',function(){
    const notesUpdateData = {
      title: 'updatedata test title',
      content: 'this talks about test cats'
    };
    return chai.request(app)
      .put('/api/notes/1005')
      .send(notesUpdateData)
      .then(function(res){
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('id', 'title', 'content');

        expect(res.body.id).to.equal(1005);
        expect(res.body.title).to.equal(notesUpdateData.title);
        expect(res.body.content).to.equal(notesUpdateData.content);
      });
  });

  it('should respond with a 404 for an invalid id',function(){
    const notesUpdateData = {
      title: 'updatedata test title',
      content: 'this talks about test cats'
    };

    return chai.request(app)
      .put('/api/notes/99999')
      .send(notesUpdateData)
      .catch(function(err){
        return err.response;
      })
      .then( res => {
        expect(res).to.have.status(404);
      });
  });

  // it('should notifiy of missing title field',function(){
  //   const notesUpdateData = {
  //     title: 'updatedata test title',
  //     content: 'this talks about test cats'      
  //   };
  //   return chai.request(app)
  //     .put('/api/notes/1004')
  //     .send(notesUpdateData)
  //     .catch(err => err.response)
  //     .then(function(res){
  //       expect(res).to.have.status(400);
  //       expect(res).to.be.json;
  //       expect(res.body).to.be.a('object');
  //       expect(res.body.message).to.equal('Missing `title` in request body');
  //     });
  // });

});


describe('DELETE  /api/notes/:id', function () {

  it('should delete an item by id', function () {
    return chai.request(app)
      .delete('/api/notes/1005')
      .then(function (res) {
        expect(res).to.have.status(204);
      });
  });

});