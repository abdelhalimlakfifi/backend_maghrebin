const express = require('express');
const router = express.Router();
const userOtpVerification = require('../../controllers/backoffice/userOtpVerification.controller');


router.post('/check-email', userOtpVerification.inputsValidates ,userOtpVerification.checkEmail);
router.post('/check-otp', userOtpVerification.checkOtpInput, userOtpVerification.checkOtp);
router.put('/change-password', userOtpVerification.changePassword);


module.exports=router;
