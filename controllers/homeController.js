// controllers/homeController.js
const getHome = (req, res) => {
    res.json({ message: 'Welcome to the home route!', user: req.user });
  };
  
  module.exports = {
    getHome,
  };
  