const express = require('express');
const router = express.Router();

const userRouteHandlers = require('../controllers/userController');
const authRouteHandler = require('../controllers/authController');

router
  .post('/signup', authRouteHandler.signUp);
router
  .post('/login', authRouteHandler.login);

router
  .post('/forgotPassword', authRouteHandler.forgotPassword);
router
  .patch('/resetPassword/:token', authRouteHandler.resetPassword);
router
  .patch('/updateMyPassword',
    authRouteHandler.checkAuthentication,
    authRouteHandler.updatePassword
);
router
  .patch('/updateMe',
    authRouteHandler.checkAuthentication,
    userRouteHandlers.updateMe
);

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