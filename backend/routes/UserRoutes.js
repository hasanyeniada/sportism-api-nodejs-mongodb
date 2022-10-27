const express = require('express');
const router = express.Router();

const userRouteHandlers = require('../controllers/userController');
const authRouteHandler = require('../controllers/authController');

// No need to Authentication&Authorization:
router.post('/signup', authRouteHandler.signUp);
router.post('/login', authRouteHandler.login);
router.post('/forgotPassword', authRouteHandler.forgotPassword);
router.patch('/resetPassword/:token', authRouteHandler.resetPassword);

// All routes below, need to Authenticate!
router.use(authRouteHandler.checkAuthentication);

router.patch('/updateMyPassword', authRouteHandler.updatePassword);
router.patch('/updateMe', userRouteHandlers.updateMe);
router.delete ('/deleteMe', userRouteHandlers.deleteMe);
router.get('/me',
  userRouteHandlers.getMe,
  userRouteHandlers.getSingleUserWithId
);

// All routes below, need to Authenicate & Authorize!
router.use(authRouteHandler.checkAuthorization('admin'));

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