const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  role: {
    type: String, 
    required: true
  },
  profile_picture: {
    type: String, 
    default: null 
  },
  categories_clicks: [{
    category_id: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Category' 
    },
    count: Number
  }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
