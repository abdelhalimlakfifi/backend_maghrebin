const mongoose = require('mongoose');

// Creating a schema specifically for color filtering
const colorSchema = new mongoose.Schema({
  color: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    required: false, 
  },
  updated_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updated_by: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  deleted_at: {
    type: Date,
    required: false, 
  },
  deleted_by: {
    type: mongoose.Schema.Types.ObjectId,
    required: false, 
  },
});

// Creating a model using the color schema
const ColorFilter = mongoose.model('ColorFilter', colorSchema);

module.exports = ColorFilter;