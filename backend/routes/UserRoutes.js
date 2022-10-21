const express = require('express');
const router = express.Router();

const userRouteHandlers = require('../controllers/UserController');
const authRouteHandler = require('../controllers/authController');

router
  .post('/signup', authRouteHandler.signUp);

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
