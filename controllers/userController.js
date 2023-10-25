// controllers/userController.js
const getUser = (req, res) => {
    res.json({ message: 'Welcome to the user route!', user: req.user });
  };
  
  module.exports = {
    getUser,
  };
  