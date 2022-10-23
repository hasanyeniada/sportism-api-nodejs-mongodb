const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const signUp = catchAsync(async (req, resp, next) => {
  const requestedUserData = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role
  };
  const newUser = await User.create(requestedUserData);

  const token = signToken(newUser._id);

  resp.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

const login = catchAsync(async (req, resp, next) => {
  const { email, password: passwordFromRequest } = req.body;
  if (!email || !passwordFromRequest) {
    return next(new AppError('Please provide email or password!', 400));
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !await user.correctPassword(passwordFromRequest, user.password)) {
    return next(new AppError('Invalid email or password!', 400));
  }
  
  const token = signToken(user._id);
  resp.status(200).json({
    status: 'success',
    data: {
      token,
    },
  });
});

const checkAuthentication = catchAsync(async (req, resp, next) => {
  // 1) Getting the token and check if it is there
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer')
  ) {
    return next(
      new AppError('You are not logged in! Please login to get access.', 401)
    );
  }
  const token = req.headers.authorization.split(' ')[1];

  // 2) Validate the token
  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  // 3) Check if user still exists
  const currentUser = await User.findById(decodedToken.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging this token does no longer exist.', 401)
    );
  }

  // 4) Check if user changed password after token was issued
  const isPswChanged = await currentUser.checkIfPasswordChanged(
    decodedToken.iat
  );
  if (isPswChanged) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  // 5) Grant Access To Protected Route
  req.user = currentUser;
  next();
});

const checkAuthorization = (...roles) => {
  return (req, resp, next) => {
    console.log(req.user.role);
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform that action', 403)
      );
    }
    next();
  };
};

module.exports = {
  signUp,
  login,
  checkAuthentication,
  checkAuthorization,
};
