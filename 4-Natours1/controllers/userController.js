const fs = require('fs');
const express = require('express');

const app = express();
//Middleware
app.use(express.json());

//USER HANDLERS
exports.getAllUsers = (req, res) => {
  res.status(504).json({
    status: 'error',
    message: 'This route is not defiend yet :)',
  });
};

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
