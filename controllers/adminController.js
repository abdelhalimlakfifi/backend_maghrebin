// controllers/adminController.js
const getAdmin = (req, res) => {
    res.json({ message: 'Welcome to the admin route!', user: req.user });
  };
  
  module.exports = {
    getAdmin,
  };
  