const express = require('express');
const reviewRouter = express.Router({
    mergeParams: true
})

const reviewRouteHandler = require('../controllers/reviewController');
const authController = require('../controllers/authController');

// POST /tour/234fad4/reviews
// GET /tour/234fad4/reviews
// GET /tour/234fad4/reviews/94887fda
// POST /reviews
// GET /reviews

reviewRouter
  .route('/')
  .get(reviewRouteHandler.getAllReviews)
  .post(
    authController.checkAuthentication,
    authController.checkAuthorization('user'),
    reviewRouteHandler.createNewReview
  );

reviewRouter
  .route('/:id')
  .get(reviewRouteHandler.getSingleReview)
  .delete(reviewRouteHandler.deleteReview)
  .patch(reviewRouteHandler.updateReview);

module.exports = reviewRouter;