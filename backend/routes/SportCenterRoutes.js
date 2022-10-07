const express = require('express');
const router = express.Router();

const sportCenterRouteHandlers = require('../controllers/SportCenterController');

router.param('id', sportCenterRouteHandlers.checkId);

router
  .route('/')
  .get(sportCenterRouteHandlers.getAllSportCenters)
  .post(sportCenterRouteHandlers.checkBody, sportCenterRouteHandlers.createSportCenter);
  
router
  .route('/:id')
  .get(sportCenterRouteHandlers.getSingleSportCenterWithId)
  .patch(sportCenterRouteHandlers.updateSportCenterWithId)
  .delete(sportCenterRouteHandlers.deleteSportCenterWithId);

module.exports = router;