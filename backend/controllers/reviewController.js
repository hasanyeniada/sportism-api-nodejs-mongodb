const routeHandlerFactory = require('./routeHandlerFactory');
const Review = require('../models/reviewModel');

const setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

const getAllReviews = routeHandlerFactory.getAll(Review);
const getSingleReview = routeHandlerFactory.getOne(Review);
const createNewReview = routeHandlerFactory.createOne(Review);
const updateReview = routeHandlerFactory.updateOne(Review);
const deleteReview = routeHandlerFactory.deleteOne(Review);

module.exports = {
  getAllReviews,
  createNewReview,
  getSingleReview,
  deleteReview,
  updateReview,
  setTourUserIds,
};
