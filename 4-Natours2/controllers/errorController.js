const AppError = require('../utils/appError');

const handleCasteError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handlehandleDuplicateFields = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  console.log(value);
  const message = `Duplicate field value:${value}.Please use another value.`;
  return new AppError(message, 400);
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  // console.log(errors);
  const message = `Invalid Input Data:${errors.join('.')}`;
  return new AppError(message, 400);
};

const handleJsonWebTokenError = (err) => {
  const message = 'Invalid token.Please login again.';
  return new AppError(message, 401);
};

const handleTokenExpiredError = (err) => {
  const message = 'Token expired! Please login again.';
  return new AppError(message, 401);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  //Operational
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: 'fail',
      message: 'Something went wrong!!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  const NODE_ENV = process.env.NODE_ENV || 'development';
  if (NODE_ENV === 'development') {
    //Not a good practice to override the err obj coming from middleware ,so hardcode the error variable
    console.log(err.name);

    sendErrorDev(err, res);
  } else if (NODE_ENV === 'production ') {
    // console.log(err);
    // let { name } = err;
    let error = err;
    console.log(error.name);
    if (error.name === 'CastError') error = handleCasteError(err);
    if (error.name === 'MongoServerError' && error.code === 11000)
      error = handlehandleDuplicateFields(error);
    if (error.name === 'ValidationError') error = handleValidationError(error);
    if (error.name === 'JsonWebTokenError') {
      error = handleJsonWebTokenError(error);
    }
    if (error.name === 'TokenExpiredError')
      error = handleTokenExpiredError(error);
    sendErrorProd(error, res);
  } else {
    console.log('unhandled env');
  }
};
