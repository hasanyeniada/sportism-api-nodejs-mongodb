const mongoose = require('mongoose');
const slugify = require('slugify');

const sportCenterSchema = new mongoose.Schema(
  {
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
      default: 4,
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
      default: 'TL',
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
      select: false,
    },
    slug: String,
    secretSportCenter: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

sportCenterSchema.virtual('workingDuration').get(function () {
  return (
    Number(this.workingHours[1].split(':')[0]) -
    Number(this.workingHours[0].split(':')[0])
  );
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
sportCenterSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

sportCenterSchema.pre('save', function(next) {
  console.log('Will save document...');
  next();
});

sportCenterSchema.post('save', function(doc, next) {
  console.log(doc);
  next();
});

// QUERY MIDDLEWARE
// sportCenterSchema.pre('find', function(next) {
sportCenterSchema.pre(/^find/, function (next) {
  this.find({ secretSportCenter: { $ne: true } });

  this.start = Date.now();
  next();
});

sportCenterSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

// AGGREGATION MIDDLEWARE
sportCenterSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretSportCenter: { $ne: true } } });

  console.log(this.pipeline());
  next();
});

const SportCenter = mongoose.model('SportCenter', sportCenterSchema);

module.exports = SportCenter;