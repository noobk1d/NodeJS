const fs = require('fs');
const express = require('express');
const Tours = require('../model/tourModel');

const app = express();
//Middleware
app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

//Check ID
exports.checkId = (req, res, next, val) => {
  console.log(`Tour ID is ${val}`);

  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({ status: 'fail', message: 'Invalid Id' });
  }
  next();
};

//Check Body
exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res
      .status(404)
      .json({ status: 'fail', message: 'Missing name or price.' });
  }
  next();
};

//ROUTE HANDLERS
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestedTime,
    result: tours.length,
    tours,
  });
};

exports.getTour = (req, res) => {
  // console.log(typeof req.params.id);
  // console.log(req.params);
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  // console.log(tour);
  if (!tour) {
    res.status(404).json({ status: 'fail', message: 'Invalid Id' });
  }
  res.status(200).json({ status: 'success', data: { tour } });
  // res.send(req.params);
};

exports.createTour = (req, res) => {
  // console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);

  fs.writeFile(
    './dev-data/data/tours-simple.json',
    JSON.stringify(tours),
    (err) => {
      res
        .status(200)
        .json({ status: 'success', length: tours.length, data: newTour });
    }
  );
};

exports.updateTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  console.log(tour);
  if (!tour) {
    res.status(404).json({ status: 'fail', message: 'Invalid Id' });
  }
  res.status(200).json({ status: 'success', message: 'Tour Updated' });
};

exports.deleteTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  console.log(tour);
  if (!tour) {
    res.status(404).json({ status: 'fail', message: 'Invalid Id' });
  }
  res.status(204).json({ status: 'success', data: null });
};
