const express = require('express');
const reviewRouter = express.Router({
    mergeParams: true
})

const reviewRouteHandler = require('../controllers/reviewController');
const authController = require('../controllers/authController');

// POST /sportCenter/234fad4/reviews
// GET /sportCenter/234fad4/reviews
// GET /sportCenter/234fad4/reviews/94887fda
// POST /reviews
// GET /reviews

// All routes below, need to Authenticate!
reviewRouter.use(authController.checkAuthentication);

reviewRouter
  .route('/')
  .get(reviewRouteHandler.getAllReviews)
  .post(
    authController.checkAuthorization('user'),
    reviewRouteHandler.setTourUserIds,
    reviewRouteHandler.createNewReview
  );

reviewRouter
  .route('/:id')
  .get(reviewRouteHandler.getSingleReview)
  .delete(
    authController.checkAuthorization('user', 'admin'),
    reviewRouteHandler.deleteReview
  )
  .patch(
    authController.checkAuthorization('user', 'admin'),
    reviewRouteHandler.updateReview
  );

module.exports = reviewRouter;