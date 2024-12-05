const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

//Middleware
app.use(express.json());

//Our Own Middleware
app.use((req, res, next) => {
  req.requestedTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

//3rd pary Middleware
app.use(morgan('dev'));

//ROUTING MIDDLEWARE
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//Handling unhandled routes
// app.all('*', (req, res, next) => {
//   res.status(404).json({
//     status: 'fail',
//     message: `Can't find ${req.originalUrl} on this server.`,
//   });
// });

// app.all('*', (req, res, next) => {
//   const err = new Error(`Can't find ${req.originalUrl} on this server.`);
//   err.status = 'fail';
//   err.statusCode = 404;
//   next(err);
// });

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server)`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
