const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

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

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//API

//ROUTE HANDLERS
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestedTime,
    result: tours.length,
    tours,
  });
};

const getTour = (req, res) => {
  console.log(typeof req.params.id);
  console.log(req.params);
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  console.log(tour);
  if (!tour) {
    res.status(404).json({ status: 'fail', message: 'Invalid Id' });
  }
  res.status(200).json({ status: 'success', data: { tour } });
  // res.send(req.params);
};

const createTour = (req, res) => {
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

const updateTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  console.log(tour);
  if (!tour) {
    res.status(404).json({ status: 'fail', message: 'Invalid Id' });
  }
  res.status(200).json({ status: 'success', message: 'Tour Updated' });
};

const deleteTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  console.log(tour);
  if (!tour) {
    res.status(404).json({ status: 'fail', message: 'Invalid Id' });
  }
  res.status(204).json({ status: 'success', data: null });
};

//GET
// app.get('/api/v1/tours', getAllTours);

//POST
// app.post('/api/v1/tours/', createTour);

//ID
// app.get('/api/v1/tours/:id', getTour);

//PATCH
// app.patch('/api/v1/tours/:id', updateTour);

//DELETE
// app.delete('/api/v1/tours/:id', deleteTour);

//ROUTE
app.route('/api/v1/tours').get(getAllTours).post(updateTour);
app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

//
const port = 3000;
app.listen(3000, () => {
  console.log(`App running on port ${port}`);
});
