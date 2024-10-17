const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./tourRoutes');
const userRouter = require('./userRoutes');

const app = express();

//Middleware
app.use(express.json());

//Our Own Middleware
app.use((req, res, next) => {
  req.requestedTime = new Date().toISOString();
  next();
});

//3rd pary Middleware
app.use(morgan('dev'));

//ROUTING MIDDLEWARE
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
//

module.exports = app;
