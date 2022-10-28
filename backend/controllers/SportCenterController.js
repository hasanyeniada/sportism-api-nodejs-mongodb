const SportCenter = require('../models/sportCenterModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const routeHandlerFactory = require('./routeHandlerFactory');

const aliasTopSportCenters = (req, resp, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,monthlyPrice';
  req.query.fields = 'name,monthlyPrice,ratingsAverage,summary,workingHours';
  next();
};

const getAllSportCenters = routeHandlerFactory.getAll(SportCenter);
const getSingleSportCenterWithId = routeHandlerFactory.getOne(SportCenter, {
  path: 'reviews',
});
const createSportCenter = routeHandlerFactory.createOne(SportCenter);
const updateSportCenterWithId = routeHandlerFactory.updateOne(SportCenter);
const deleteSportCenterWithId = routeHandlerFactory.deleteOne(SportCenter);

const getSportCenterStats = catchAsync(async (req, resp, next) => {
  const stats = await SportCenter.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: null,
        numSportCenters: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$monthlyPrice' },
        minPrice: { $min: '$monthlyPrice' },
        maxPrice: { $max: '$monthlyPrice' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match: { maxPrice: { $gt: 200 } }
    // }
  ]);
  resp.status(200).json({
    status: 'success',
    data: stats,
  });
});

// /sportcenters-within/:distance/center/:latlng/unit/:unit
// /sportcenters-within/233/center/34.111745,-118.113491/unit/mi
const getSportCentersWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitute and longitude in the format lat,lng.',
        400
      )
    );
  }

  console.log(lng, lat, radius);
  const sportCenters = await SportCenter.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });

  res.status(200).json({
    status: 'success',
    results: sportCenters.length,
    data: {
      data: sportCenters,
    },
  });
});

const getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitutr and longitude in the format lat,lng.',
        400
      )
    );
  }

  const distances = await SportCenter.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier
      }
    },
    {
      $project: {
        distance: 1,
        name: 1
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: distances
    }
  });
});


module.exports = {
  getAllSportCenters,
  getSingleSportCenterWithId,
  createSportCenter,
  deleteSportCenterWithId,
  updateSportCenterWithId,
  aliasTopSportCenters,
  getSportCenterStats,
  getSportCentersWithin,
  getDistances,
};
