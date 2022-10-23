const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const getAllUsers = (req, resp) => {
  resp.status(500).json({
    status: 'error',
    message: 'This route is not implemented!',
  });
};

const createUser = (req, resp) => {
  resp.status(500).json({
    status: 'error',
    message: 'This route is not implemented!',
  });
};

const getSingleUserWithId = (req, resp) => {
  resp.status(500).json({
    status: 'error',
    message: 'This route is not implemented!',
  });
};

const updateUserWithId = (req, resp) => {
  resp.status(500).json({
    status: 'error',
    message: 'This route is not implemented!',
  });
};

const deleteUserWithId = (req, resp) => {
  resp.status(500).json({
    status: 'error',
    message: 'This route is not implemented!',
  });
};

const updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

module.exports = {
  getAllUsers,
  getSingleUserWithId,
  createUser,
  deleteUserWithId,
  updateUserWithId,
  updateMe,
};
