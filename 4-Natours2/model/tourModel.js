const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

//Schema Creation
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      minLength: [10, 'A tour name must be at least 10 characters'],
      // validate: [validator.isAlpha, 'A tour name must not contain numbers'],
      validate: {
        validator: function (value) {
          return validator.isAlpha(value.replace(/\s+/g, ''));
        },
        message: 'A Tour must not contain numbers.',
      },
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a max group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'hard'],
        message: 'A tour must have a difficulty:easy,medium,hard.',
      },
    },
    ratingsAverage: { type: Number, default: 4.5 },
    ratingsQuantity: { type: Number, default: 30 },
    price: { type: Number, required: [true, 'A tour must have a price'] },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'A tour must have a price discount lower than tour price.',
      },
    },
    summary: { type: String },
    secretTour: { type: Boolean, default: false },
    description: {
      type: String,
      required: [true, 'A tour must have a description'],
      trim: true,
    },
    imageCover: { type: String, required: [true, 'A tour must have a image'] },
    images: [String],
    createdAt: { type: Date, default: Date.now(), selected: false },
    startDates: [Date],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//Document MiddleWare
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//Query Middleware
tourSchema.pre('find', function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

//Aggregation Middleware
tourSchema.pre('aggregate', function (next) {
  console.log(this.pipeline());
  // this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

//Model(Collection)
const Tour = mongoose.model('Natours', tourSchema, 'Natours');

module.exports = Tour;
