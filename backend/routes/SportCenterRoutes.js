const express = require('express');
const router = express.Router();

const sportCenterRouteHandlers = require('../controllers/SportCenterController');

router
  .route('/top-5-cheap')
  .get(
    sportCenterRouteHandlers.aliasTopSportCenters,
    sportCenterRouteHandlers.getAllSportCenters
  );

router
  .route('/')
  .get(sportCenterRouteHandlers.getAllSportCenters)
  .post(sportCenterRouteHandlers.createSportCenter);

router
  .route('/:id')
  .get(sportCenterRouteHandlers.getSingleSportCenterWithId)
  .patch(sportCenterRouteHandlers.updateSportCenterWithId)
  .delete(sportCenterRouteHandlers.deleteSportCenterWithId);

module.exports = router;
