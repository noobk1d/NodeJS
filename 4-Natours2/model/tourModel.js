const mongoose = require('mongoose');

//Schema Creation
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  rating: { type: Number, default: 4.5 },
  price: { type: Number, required: [true, 'A tour must have a price'] },
});

//Model(Collection)
const Tour = mongoose.model('Natours', tourSchema, 'Natours');

module.exports = Tour;
