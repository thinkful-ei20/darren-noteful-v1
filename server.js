'use strict';



console.log('Hello Noteful!');

const express = require('express');
const morgan = require('morgan');

const {PORT} = require('./config');

const notesRouter = require('./router/notes.router.js');

const app = express(); // creates express application

app.use(morgan('common'));

// app.use(logger); // logs all requests

app.use(express.static('public')); // creates a static webserver
app.use(express.json()); // parses request body

app.use('/api',notesRouter);




// app.get('/boom', (req, res, next) => {
//   throw new Error('Boomshakalaka!!');
// });

app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({ message: 'Not Found' });
});

//catch all error
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

if(require.main === module){
  app.listen(PORT, function () {
    console.info(`Server listening on ${this.address().port}`);
  }).on('error', err => {
    console.error(err);
  });
}

module.exports = app;

