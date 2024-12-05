const express = require('express');
const catchAsync = require('../utils/catchAsync');
const User = require('../model/userModel');

const app = express();
//Middleware
app.use(express.json());

//USER HANDLERS
exports.getAllUsers = catchAsync(async (req, res) => {
  const tours = await User.find();

  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: { tours },
  });
});

exports.getUser = (req, res) => {
  res.status(504).json({
    status: 'error',
    message: 'This route is not defiend yet :)',
  });
};

exports.createUser = (req, res) => {
  res.status(504).json({
    status: 'error',
    message: 'This route is not defiend yet :)',
  });
};

exports.updateUser = (req, res) => {
  res.status(504).json({
    status: 'error',
    message: 'This route is not defiend yet :)',
  });
};

exports.deleteUser = (req, res) => {
  res.status(504).json({
    status: 'error',
    message: 'This route is not defiend yet :)',
  });
};
