const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    role: { 
        type: String, 
        required: true 
    },
    permissions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Permission'
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }

})