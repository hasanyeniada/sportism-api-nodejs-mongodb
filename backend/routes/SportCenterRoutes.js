const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const sportCenterRouteHandlers = require('../controllers/sportCenterController');
const reviewRouter = require('../routes/reviewRoutes');

// POST /tour/234fad4/reviews
// GET /tour/234fad4/reviews
// GET /tour/234fad4/reviews/94887fda

router.use('/:sportCenterId/reviews', reviewRouter);

router
  .route('/top-5-cheap')
  .get(
    sportCenterRouteHandlers.aliasTopSportCenters,
    sportCenterRouteHandlers.getAllSportCenters
  );

router
  .route('/sportcenter-stats')
  .get(sportCenterRouteHandlers.getSportCenterStats);

router
  .route('/')
  .get(
    sportCenterRouteHandlers.getAllSportCenters
  )
  .post(
    authController.checkAuthentication,
    authController.checkAuthorization('admin', 'lead-guide'),
    sportCenterRouteHandlers.createSportCenter
  );

router
  .route('/:id')
  .get(sportCenterRouteHandlers.getSingleSportCenterWithId)
  .patch(
    authController.checkAuthentication,
    authController.checkAuthorization('admin', 'lead-guide'),
    sportCenterRouteHandlers.updateSportCenterWithId
  )
  .delete(
    authController.checkAuthentication,
    authController.checkAuthorization('admin', 'lead-guide'),
    sportCenterRouteHandlers.deleteSportCenterWithId
  );

module.exports = router;