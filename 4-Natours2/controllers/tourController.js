const fs = require('fs');
const express = require('express');
const Tour = require('../model/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

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

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingAverag,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

//ROUTE HANDLERS
exports.getAllTours = async (req, res) => {
  // try {
  //   const tours = await Tours.find();
  //   res.status(200).json({
  //     status: 'success',
  //     result: tours.length,
  //     data: { tours },
  //   });
  // } catch (err) {
  //   res.status(404).json({ status: 'fail', message: err });
  // }

  try {
    //Filtering
    //1A]Basic
    // const queryObj = { ...req.query };
    // const excludeFields = ['page', 'sort', 'limit', 'fields'];
    // excludeFields.forEach((field) => delete queryObj[field]);
    // console.log(queryObj);
    // // const query = Tour.find(queryObj);

    // //1B]Advance
    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
    // // console.log(JSON.parse(queryStr));
    // let query = Tour.find(JSON.parse(queryStr));

    // // console.log(query);
    // //2]Sort
    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(',').join(' ');
    //   console.log(sortBy);
    //   query = query.sort(sortBy);
    // }

    // //3]Field Limiting
    // if (req.query.fields) {
    //   const fields = req.query.fields.split(',').join(' ');
    //   query = query.select(fields);
    // } else {
    //   query = query.select('-__v');
    // }

    // //Pagination
    // // console.log(req.query.page);
    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 50;
    // const skip = (page - 1) * limit;

    // query = query.skip(skip).limit(limit);

    // if (req.query.page) {
    //   const numTours = await Tour.countDocuments();
    //   console.log(numTours);
    //   if (skip >= numTours) throw new Error('This page does not exist.');
    // }

    // //Query
    // const tours = await query;
    console.log(1);
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

    res.status(200).json({
      status: 'success',
      result: tours.length,
      data: { tours },
    });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err });
  }
};

exports.getTour = catchAsync(async (req, res, next) => {
  // console.log(req.params.id);
  const tour = await Tour.findById(req.params.id);
  if (!tour) {
    return next(new AppError(`No tour found with id: ${req.params.id}`, 404));
  }
  res.status(200).json({ status: 'success', data: { tour } });
});

exports.createTour = catchAsync(async (req, res) => {
  console.log(1);
  const newTour = await Tour.create(req.body);

  res.status(201).json({ status: 'success', data: { tour: newTour } });
});

exports.updateTour = catchAsync(async (req, res) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!tour) {
    return next(new AppError(`No tour found with id: ${req.params.id}`, 404));
  }

  res.status(201).json({ status: 'success', data: { tour } });
});

exports.deleteTour = catchAsync(async (req, res) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) {
    return next(new AppError(`No tour found with id: ${req.params.id}`, 404));
  }
  res.status(204).json({ status: 'success', data: null });
});

exports.getTourStats = catchAsync(async (req, res) => {
  const stats = await Tour.aggregate([
    { $match: { ratingsAverage: { $gte: 4.5 } } },
    {
      $group: {
        _id: '$difficulty',
        num: { $sum: 1 },
        maxPrice: { $max: '$price' },
      },
    },
  ]);
  res.status(201).json({ status: 'success', data: { stats } });
});

exports.getMonthlyPlan = catchAsync(async (req, res) => {
  const year = req.params.year * 1;
  console.log(year);
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        name: { $push: '$name' },
      },
    },
    {
      $sort: { startDates: 1 },
    },
    {
      $addFields: { month: '$_id' },
    },
  ]);
  res.status(201).json({ status: 'success', data: { plan } });
});
