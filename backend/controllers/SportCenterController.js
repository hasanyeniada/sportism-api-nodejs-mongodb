const SportCenter = require('../models/sportCenterModel');

const aliasTopSportCenters = (req, resp, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,monthlyPrice';
  req.query.fields = 'name,monthlyPrice,ratingsAverage,summary';
  next();
};

const getAllSportCenters = async (req, resp) => {
  try {
    console.log(req.query);
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1) Filtering
    let query = SportCenter.find(req.query);

    // Solution 2
    // const query = SportCenter.find()
    //   .where('priceDiscount')
    //   .equals(0)
    //   .where('monthlyPrice')
    //   .equals(300);

    // 2) Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    }

    // 3) Field Limiting
    if (req.query.fields) {
      const selectBy = req.query.fields.split(',').join(' ');
      query = query.select(selectBy);
    } else {
      query = query.select('-__v');
    }

    // 4) Pagination
    const page = Number(req.query.page) || 1;
    const limitBy = Number(req.query.limit) || 100;
    const skipBy = (page - 1) * limitBy;
    query = query.skip(skipBy).limit(limitBy);

    if (req.query.page) {
      // Gives number of documents
      const numTours = await SportCenter.countDocuments();
      if (skip > numTours) throw new Error('This page does not exist');
    }

    const sportCentersData = await query;

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

module.exports = {
  getAllSportCenters,
  getSingleSportCenterWithId,
  createSportCenter,
  deleteSportCenterWithId,
  updateSportCenterWithId,
  aliasTopSportCenters,
};
