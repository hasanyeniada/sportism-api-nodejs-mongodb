const SportCenter = require('../models/sportCenterModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const aliasTopSportCenters = (req, resp, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,monthlyPrice';
  req.query.fields = 'name,monthlyPrice,ratingsAverage,summary,workingHours';
  next();
};

const getAllSportCenters = catchAsync(async (req, resp, next) => {
  const features = new APIFeatures(SportCenter.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const sportCentersData = await features.query;

  resp.status(200).json({
    status: 'success',
    results: sportCentersData.length,
    data: sportCentersData,
  });
});

const getSingleSportCenterWithId = catchAsync(async (req, resp, next) => {
  const sportCenter = await SportCenter.findById(req.params.id);
  // const sportCenter = await (await SportCenter.findById(req.params.id)).populated('reviews');
  // Tour.findOne({ _id: id })

  if (!sportCenter) {
    return next(new AppError(`Can't find sportCenter with given id!`, 404));
  }

  resp.status(200).json({
    status: 'success',
    data: sportCenter,
  });
});

const createSportCenter = catchAsync(async (req, resp, next) => {
  const newSportCenter = await SportCenter.create(req.body);
  resp.status(201).json({
    status: 'success',
    data: newSportCenter,
  });
});

const updateSportCenterWithId = catchAsync(async (req, resp, next) => {
  const sportCenterUpdated = await SportCenter.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!sportCenterUpdated) {
    return next(new AppError(`Can't find sportCenter with given id!`, 404));
  }

  resp.status(200).json({
    status: 'success',
    data: { sportCenter: sportCenterUpdated },
  });
});

const deleteSportCenterWithId = catchAsync(async (req, resp, next) => {
  const sportCenterDeleted = await SportCenter.findByIdAndDelete(req.params.id);

  if (!sportCenterDeleted) {
    return next(new AppError(`Can't find sportCenter with given id!`, 404));
  }

  resp.status(200).json({
    status: 'success',
    data: null,
  });
});

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
