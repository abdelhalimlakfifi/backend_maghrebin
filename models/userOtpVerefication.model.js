const mongoose = require("mongoose");



const userOtpVerification = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    otp: {
        type: String,
        require: true,
    },
    isvalidate: {
        type: Boolean,
        require: true,
        default: false
    },
    resetToken:{
        type: String,
        default:null
    },
    createAt:{
        type: Date,
        default: new Date()
    }
});



const UserOtpVerification = mongoose.model('UserOtpVerefication', userOtpVerification, "user_otp_verefications");


module.exports = UserOtpVerification

