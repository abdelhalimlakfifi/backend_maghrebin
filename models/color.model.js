const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    hexCode: {
        type: String,
        required: true,
        validate: /^#([0-9a-f]{3}){1,2}$/i,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming there's a User model
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    deletedAt: {
        type: Date,
        default: null,
    },
}, {
  timestamps: true, // This adds createdAt and updatedAt automatically
});

// Create the Color model
const Color = mongoose.model('Color', colorSchema);

module.exports = Color;
