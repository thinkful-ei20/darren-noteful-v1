'use strict';

const data = require('./db/notes');

console.log('Hello Noteful!');

// INSERT EXPRESS APP CODE HERE...
const express = require('express');
const app = express();
const PORT = 8080;

app.use(express.static('public'));

app.get('/api/notes', (req, res) => {

  const searchTerm = req.query.searchTerm;

  if(searchTerm) {
    let filteredList = data.filter(function(item) {
      return item.title.includes(searchTerm);
    });
    res.json(filteredList);
  } else {
    res.json(data);
  }

  // (searchTerm) ? data.filter(item =)
});

app.get('/api/notes/:id', (req, res) => {
  const id = +req.params.id;    
  const foundItem = data.find(item => item.id === id);
  res.json(foundItem);
});


app.listen(PORT, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});


