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
  .get(authController.protect, sportCenterRouteHandlers.getAllSportCenters)
  .post(sportCenterRouteHandlers.createSportCenter);

router
  .route('/:id')
  .get(sportCenterRouteHandlers.getSingleSportCenterWithId)
  .patch(sportCenterRouteHandlers.updateSportCenterWithId)
  .delete(sportCenterRouteHandlers.deleteSportCenterWithId);

module.exports = router;
