const express = require('express');
const router = express.Router();

const userRouteHandlers = require('../controllers/UserController');

router
  .route('/')
  .get(userRouteHandlers.getAllUsers)
  .post(userRouteHandlers.createUser);

router
  .route('/:id')
  .get(userRouteHandlers.getSingleUserWithId)
  .patch(userRouteHandlers.updateUserWithId)
  .delete(userRouteHandlers.deleteUserWithId);

module.exports = router;
