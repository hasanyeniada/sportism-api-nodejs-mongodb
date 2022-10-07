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

module.exports = {
    getAllUsers,
    getSingleUserWithId,
    createUser,
    deleteUserWithId,
    updateUserWithId
}