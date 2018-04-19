'use strict';

const express = require('express');
const router = express.Router();

//Simple In-Memory Database
const data = require('../db/notes');
const simDB = require('../db/simDB');  // <<== add this
const notes = simDB.initialize(data); // <<== and this


router.get('/notes', (req, res, next) => {

  const {searchTerm} = req.query;

  // notes.filter(searchTerm, (err, list) => {
  //   if (err) {
  //     return next(err); // goes to error handler
  //   }
  //   res.json(list); // responds with filtered array
  // }); 

  notes.filter(searchTerm)
    .then( list => {
      res.json(list);
    })
    .catch(err => {      
      next(err);      
    });
});

router.get('/notes/:id', (req, res, next) => {
  const id = +req.params.id;      
  // notes.find(id, (err, item) => {
  //   if (err) {
  //     return next(err);
  //   }
  //   if (item) {
  //     res.json(item);
  //   } else {
  //     next();
  //   }
  // });
  //Promises version :
  notes.find(id)
    .then(item => {      
      if (item) {
        res.json(item);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
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

  //promise version 83-92 :

  notes.update(id,updateObj)
    .then( item => {
      if(item) {
        res.json(item);
      }else{
        next();
      }
    })
    .catch(err => {
      next(err);
    });


  /***** Never trust users - validate input *****/
  //  if (!updateObj.title) {
  //   const err = new Error('Missing `title` in request body');   }
  //   err.status = 400;
  //   return next(err);
  //  }

  // notes.update(id, updateObj, (err, item) => {
  //   if (err) {
  //     return next(err);
  //   }
  //   if (item) {
  //     res.json(item);
  //   } else {
  //     next();
  //   }
  // });

});

// Post (insert) an item
router.post('/notes', (req, res, next) => {
  const { title, content } = req.body;

  const newItem = { title, content };
  /***** Never trust users - validate input *****/
  if (!newItem.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  //promises version:
  notes.create(newItem)
    .then( item => {
      if (item) {
        res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
 
  // notes.create(newItem, (err, item) => {
  //   if (err) {
  //     return next(err);
  //   }
  //   if (item) {
  //     res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item);
  //   } else {
  //     next();
  //   }
  // });

});

router.delete('/notes/:id', (req,res,next) => {
  const id = req.params.id;

  //promise version:

  notes.delete(id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(err => {
      next(err);
    });

  // notes.delete(id, (err) => {
  //   if (err) {
  //     return next(err);
  //   }
  //   else {
  //     res.sendStatus(204);      
  //   }
  // });
});



module.exports = router;