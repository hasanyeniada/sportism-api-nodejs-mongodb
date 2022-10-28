const mongoose = require('mongoose');
const slugify = require('slugify');

const sportCenterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A SportCenter must have a name'],
      unique: true,
      maxlength: [
        40,
        'A SportCenter name must have less or equal then 40 characters',
      ],
      minlength: [
        10,
        'A SportCenter name must have more or equal then 10 characters',
      ],
      // validate: [validator.isAlpha, 'Tour name must only contain characters']
    },
    workingHours: {
      type: Array,
      required: [true, 'A SportCenter must have workingHours'],
    },
    ratingsAverage: {
      type: Number,
      default: 4,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10),
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
      validate: {
        validator: function (val) {
          // this only points to current doc on NEW document creation
          return val < this.monthlyPrice;
        },
        message:
          'Discount monthlyPrice ({VALUE}) should be below regular monthlyPrice',
      },
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
    location: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    personalTrainers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// 1: sorting price index in ascending order
// -1: sorting price index in descending order
// tourSchema.index({ monthlyPrice: 1 });
sportCenterSchema.index({ monthlyPrice: 1, ratingsAverage: -1 });
sportCenterSchema.index({ slug: 1 });
sportCenterSchema.index({ location: '2dsphere' });

sportCenterSchema.virtual('workingDuration').get(function () {
  // return (
  //   Number(this.workingHours[1].split(':')[0]) -
  //   Number(this.workingHours[0].split(':')[0])
  // );
});

// Virtual Populate
sportCenterSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'sportCenter',
  localField: '_id',
});


// DOCUMENT MIDDLEWARE: runs before .save() and .create()
sportCenterSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

sportCenterSchema.pre('save', function (next) {
  console.log('Will save document...');
  next();
});

sportCenterSchema.post('save', function (doc, next) {
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

sportCenterSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'personalTrainers',
    select: '-__v -passwordChangedAt',
  });
  next();
});


// AGGREGATION MIDDLEWARE
// sportCenterSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretSportCenter: { $ne: true } } });

//   console.log(this.pipeline());
//   next();
// });

const SportCenter = mongoose.model('SportCenter', sportCenterSchema);

module.exports = SportCenter;