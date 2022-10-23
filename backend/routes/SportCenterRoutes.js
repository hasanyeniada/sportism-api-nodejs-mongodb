const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const sportCenterRouteHandlers = require('../controllers/sportCenterController');
const SportCenter = require('../models/sportCenterModel');

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
    authController.checkAuthentication,
    sportCenterRouteHandlers.getAllSportCenters
  )
  .post(sportCenterRouteHandlers.createSportCenter);

router
  .route('/:id')
  .get(sportCenterRouteHandlers.getSingleSportCenterWithId)
  .patch(sportCenterRouteHandlers.updateSportCenterWithId)
  .delete(
    authController.checkAuthentication,
    authController.checkAuthorization('admin', 'lead-guide'),
    sportCenterRouteHandlers.deleteSportCenterWithId
  );

module.exports = router;
