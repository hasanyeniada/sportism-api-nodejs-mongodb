const SportCenter = require('../models/sportCenterModel');
const APIFeatures = require('../utils/apiFeatures');

const aliasTopSportCenters = (req, resp, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,monthlyPrice';
  req.query.fields = 'name,monthlyPrice,ratingsAverage,summary';
  next();
};

const getAllSportCenters = async (req, resp) => {
  try {
    const features = new APIFeatures(
      SportCenter.find(),
      req.query
    )
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
    
  } catch (err) {
    resp.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

const getSingleSportCenterWithId = async (req, resp) => {
  try {
    const sportCenter = await SportCenter.findById(req.params.id);
    console.log(req.params.id);
    // Tour.findOne({ _id: id })

    resp.status(200).json({
      status: 'success',
      data: sportCenter,
    });
  } catch (err) {
    resp.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

const createSportCenter = async (req, resp) => {
  try {
    const newSportCenter = await SportCenter.create(req.body);
    console.log(newSportCenter);
    resp.status(201).json({
      status: 'success',
      data: newSportCenter,
    });
  } catch (err) {
    resp.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

const updateSportCenterWithId = async (req, resp) => {
  try {
    const sportCenterUpdated = await SportCenter.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    resp.status(200).json({
      status: 'success',
      data: { sportCenter: sportCenterUpdated },
    });
  } catch (err) {
    resp.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

const deleteSportCenterWithId = async (req, resp) => {
  try {
    await SportCenter.findByIdAndDelete(req.params.id);
    resp.status(200).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    resp.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

const getSportCenterStats = async (req, resp) => {
  try {
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

  } catch (err) {
    resp.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

module.exports = {
  getAllSportCenters,
  getSingleSportCenterWithId,
  createSportCenter,
  deleteSportCenterWithId,
  updateSportCenterWithId,
  aliasTopSportCenters,
  getSportCenterStats
};
