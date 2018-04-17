'use strict';

//Simple In-Memory Database
const data = require('./db/notes');
const simDB = require('./db/simDB');  // <<== add this
const notes = simDB.initialize(data); // <<== and this


console.log('Hello Noteful!');

const express = require('express');
const app = express(); // creates express application
const {PORT} = require('./config');
const {logger} = require('./middleware/logger');


app.use(logger); // logs all requests

app.use(express.static('public')); // creates a static webserver
app.use(express.json()); // parses request body

app.get('/api/notes', (req, res, next) => {

  const {searchTerm} = req.query;

  notes.filter(searchTerm, (err, list) => {
    if (err) {
      return next(err); // goes to error handler
    }
    res.json(list); // responds with filtered array
  });


  // if(searchTerm) {
  //   let filteredList = data.filter(function(item) {
  //     return item.title.includes(searchTerm);
  //   });
  //   res.json(filteredList);
  // } else {
  //   res.json(data);
  // }
 
});


// app.get('/api/notes/:id', (req, res, next) => {
//   const id = +req.params.id;    
//   const foundItem = data.find(item => item.id === id);

//   if(foundItem) {
//     res.json(foundItem);
//   } else {
//     next();
//   }  
// });

app.get('/api/notes/:id', (req, res, next) => {
  const id = +req.params.id;    
  const foundItem = data.find(item => item.id === id);
  // console.log(id);
  // console.log(foundItem);

  notes.find(id, (err, foundItem) => {
    if (err) {
      return next(err);
    }
    if (foundItem) {
      res.json(foundItem);
    } else {
      next();
    }
  });
});





app.put('/api/notes/:id', (req, res, next) => {
  const id = req.params.id;

  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateFields = ['title', 'content'];

  updateFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  notes.update(id, updateObj, (err, item) => {
    if (err) {
      return next(err);
    }
    if (item) {
      res.json(item);
    } else {
      next();
    }
  });
});










// app.get('/boom', (req, res, next) => {
//   throw new Error('Boomshakalaka!!');
// });

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({ message: 'Not Found' });
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

app.listen(PORT, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});


