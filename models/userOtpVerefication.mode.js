const mongoose = require("mongoose");



const userOtpVerefication = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    otp: {
        type: String,
        require: true,
    },
    expiredAt: {
        type: Date,
        require: true
    }
},
{
    timestamps: true,
})