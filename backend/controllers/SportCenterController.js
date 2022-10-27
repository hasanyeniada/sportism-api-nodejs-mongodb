const SportCenter = require('../models/sportCenterModel');
const catchAsync = require('../utils/catchAsync');
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

module.exports = {
  getAllSportCenters,
  getSingleSportCenterWithId,
  createSportCenter,
  deleteSportCenterWithId,
  updateSportCenterWithId,
  aliasTopSportCenters,
  getSportCenterStats,
};
