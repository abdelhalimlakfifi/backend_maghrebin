// controllers/customerController.js
const getCustomer = (req, res) => {
    res.json({ message: 'Welcome to the customer route!', user: req.user });
  };
  
  module.exports = {
    getCustomer,
  };
  