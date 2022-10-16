const mongoose = require('mongoose');

const sportCenterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A SportCenter must have a name'],
    unique: true,
  },
  workingHours: {
    type: Array,
    required: [true, 'A SportCenter must have workingHours'],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  monthlyPrice: {
    type: Number,
    required: [true, 'A SportCenter must have a price'],
  },
  priceCurrency: {
    type: String,
    default: 'TL'
  },
  priceDiscount: {
    type: Number,
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'A SportCenter must have a summary'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'A SportCenter must have a imageCover'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
});

const SportCenter = mongoose.model('SportCenter', sportCenterSchema);

module.exports = SportCenter;