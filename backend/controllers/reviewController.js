const catchAsync = require('../utils/catchAsync');
const Review = require('../models/reviewModel');

const getAllReviews = catchAsync(async (req, resp, next) => {
  let filter = {};
  if (req.params.sportCenterId) {
    filter = {
      sportCenter: req.params.sportCenterId,
    };
  }

  const reviews = await Review.find(filter);

  resp.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

const createNewReview = catchAsync(async (req, resp, next) => {
  if (!req.body.sportCenter) {
    req.body.sportCenter = req.params.sportCenterId;
  }
  if (!req.body.user) {
    req.body.user = req.user.id;
  }

  const newReview = await Review.create(req.body);

  resp.status(200).json({
    status: 'success',
    data: {
      newReview,
    },
  });
});

const getSingleReview = catchAsync(async (req, resp, next) => {});

const deleteReview = catchAsync(async (req, resp, next) => {});

const updateReview = catchAsync(async (req, resp, next) => {});

module.exports = {
  getAllReviews,
  createNewReview,
  getSingleReview,
  deleteReview,
  updateReview,
};
