'use strict';

const express = require('express');
const router = express.Router();

//Simple In-Memory Database
const data = require('../db/notes');
const simDB = require('../db/simDB');  // <<== add this
const notes = simDB.initialize(data); // <<== and this


router.get('/notes', (req, res, next) => {

  const {searchTerm} = req.query;

  notes.filter(searchTerm, (err, list) => {
    if (err) {
      return next(err); // goes to error handler
    }
    res.json(list); // responds with filtered array
  }); 
});

router.get('/notes/:id', (req, res, next) => {
  const id = +req.params.id;    
  
  // console.log(id);
  // console.log(foundItem);

  notes.find(id, (err, item) => {
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





router.put('/notes/:id', (req, res, next) => {
  const id = req.params.id;

 
  const updateObj = {};
  const updateFields = ['title', 'content'];

  updateFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  /***** Never trust users - validate input *****/
  //  if (!updateObj.title) {
  //   const err = new Error('Missing `title` in request body');   }
  //   err.status = 400;
  //   return next(err);
  //  }

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

module.exports = router;