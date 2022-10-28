const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { promisify } = require('util');

const User = require('../models/userModel');
const sendEmail = require('../utils/email');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const createSendToken = (user, statusCode, resp) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  resp.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  resp.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

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

  createSendToken(newUser, 201, resp);
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
  
  createSendToken(user, 200, resp);
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

const forgotPassword = catchAsync(async (req, resp, next) => {
  // 1) Get the user base on POSTed email.
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    next(new AppError('There is no user with emaill address.', 404));
  }

  // 2) Generate the random reset token
  const resetToken = await user.constructor.createResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
  console.log(resetURL);
  
  const message = `Forgot your password? Submit a PATCH request with 
                    your new password and passwordConfirm to: ${resetURL}.
                    \nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });

  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
});

const resetPassword = catchAsync(async (req, resp, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  createSendToken(user, 200, res);
});  

const updatePassword = catchAsync(async (req, resp, next) => {
  console.log(req.user);
  // 1) Get the user from collection.
  const userToUpdatePsw = await User
    .findById(req.user.id)
    .select('+password');

  if (!userToUpdatePsw) {
    next(new AppError('You should log in to update your password.', 401));
  }
  console.log(userToUpdatePsw);

  // 2) Check if POSTed password is correct.
  if (!(await userToUpdatePsw.correctPassword(req.body.password, userToUpdatePsw.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) If so, update the password.
  userToUpdatePsw.password = req.body.newPassword;
  userToUpdatePsw.passwordConfirm = req.body.newPassword;
  await userToUpdatePsw.save();

  // 4) Log the user in, send JWT back to user.
  createSendToken(userToUpdatePsw, 200, resp);
});

  
module.exports = {
  signUp,
  login,
  checkAuthentication,
  checkAuthorization,
  forgotPassword,
  resetPassword,
  updatePassword
};
