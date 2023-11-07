const UserOtpVerefication = require('../../models/userOtpVerefication.model');
const { internalError } = require('../../utils/500'); // Import a custom internalError function.
const { body, validationResult } = require('express-validator'); // Import express-validator for input validation.
const mongoose = require('mongoose'); // Import mongoose for working with MongoDB.
const User = require('../../models/user.model');
const nodemailer = require('nodemailer');
require('dotenv').config();
const otplib = require('otplib');
const jwt = require("jsonwebtoken");         // For generating JSON Web Tokens.
const bcrypt = require('bcrypt');



function diffetenceBetweenDateInMinutes(date) {
    
    const now = new Date();


    const timeDifference = Math.abs(now - date);

    const minutesDifference = Math.floor(timeDifference / (1000 * 60));
    return minutesDifference;
}
function DateFormat(date){
    var days = date.getDate();
    var year = date.getFullYear();
    var month = (date.getMonth()+1);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = days + '/' + month + '/' + year + '/ '+hours + ':' + minutes;
    return strTime;
}


const inputsValidates = [
    body('email')
        .notEmpty()
        .isEmail(),
]

const checkOtpInput = [
    body('otpCode')
        .notEmpty()
]

const changePasswordInputs = [
    body('password').notEmpty(),
    body('confirmation_password').notEmpty(),
]

const checkEmail = async (req, res) => {
    try {
        const transporter = nodemailer.createTransport({
            port: process.env.EMAIL_PORT,               // true for 465, false for other ports
            host: process.env.EMAIL_HOST,
                auth: {
                        user: process.env.EMAIL_USEREMAIL,
                        pass: process.env.EMAIL_PASSWORD,
                    },
            secure: true,
        });
        
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array()
            });
        }


        const user = await User.findOne({ email: req.body.email});

        if(!user){
            return res.status(404).json({
                error: `User with (${req.body.email}) not found`
            });
        }

        const otp = otplib.authenticator.generate(process.env.OTP_SECRET);

        const now = new Date();
        
        const otpVerification = new UserOtpVerefication({
            userId: user._id,
            otp: otp,
            createAt: now,
            isvalidate: false
        })

        await otpVerification.save();

        const mailOptions = {
            from: process.env.EMAIL_USEREMAIL,
            to: user.email, // The recipient's email address
            subject: "Reset password verification code",
            html: `
                    <div style="font-family: Helvetica,Arial,sans-serif;overflow:auto;line-height:2">
                        <div style="margin:50px auto;width:30%;padding:20px 0">
                            <div style="border-bottom:1px solid #eee">
                                <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">
                                    
                                    <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 39.21">
                                        <defs>
                                            <style>
                                                .cls-1 {
                                                    fill: #2b2b2b;
                                                }
                                            </style>
                                        </defs>
                                        <path class="cls-1"
                                            d="m25.87,7.31v18.83c0,1.16.23,1.66.76,1.96v.23h-4.12v-.23c.5-.3.76-.8.76-1.96V6.08l-9.17,15.88h-.3L4.32,7.48v16.87c0,1.43,1,3.19,2.09,3.75v.23H1.96v-.23c1.1-.56,2.09-2.32,2.09-3.75V7.15l-1.49-2.06h2.99l9.53,14.71,8.47-14.71h3.09v.27c-.53.3-.76.76-.76,1.96Z" />
                                        <path class="cls-1"
                                            d="m44.61,27.83h-3.35v-4.65c-.86,2.92-2.69,4.85-5.88,4.85-2.72,0-5.38-1.3-5.81-3.69-.56-3.39,1.46-5.38,4.02-6.44-.86-1.93.17-6.04,4.62-6.04,2.76,0,5.68,1.46,5.68,5.55v8.24c0,1.16.23,1.66.73,1.96v.23Zm-3.35-5.25v-5.11c-.17-.07-.96-.3-1.99-.3-3.62,0-8.54,1.79-7.11,7.64.43,1.79,2.36,2.89,4.02,2.79,2.89-.17,4.42-2.62,5.08-5.02Zm-7.34-4.82c1.79-.66,3.79-.9,5.35-.9.76,0,1.43.13,1.99.3v-.23c0-2.52-1-4.75-3.35-4.75-2.99,0-4.98,2.89-3.99,5.58Z" />
                                        <path class="cls-1"
                                            d="m110.78,23.06c-.2,2.36-2.29,5.48-7.01,5.48s-9-2.26-9.13-7.74c-.17-5.75,5.05-8.24,8.7-8.44,2.82-.13,6.71,1.23,7.17,5.25h-3.09c1.89.5,3.62,2.42,3.35,5.45Zm-4.72-5.45h-8.6c-.43,1.76-.33,3.72.23,5.31,1.23,3.49,3.72,5.02,7.11,4.88,2.86-.13,5.35-2.09,5.68-4.68.4-3.45-1.89-5.51-4.42-5.51Zm-8.54-.27h10.59c-.43-2.89-3.02-5.21-6.28-4.58-2.26.43-3.72,2.32-4.32,4.58Z" />
                                        <path class="cls-1"
                                            d="m129.61,18.9c.23,8.24-7.41,9.63-11.13,9.63-1.73,0-3.02-.73-3.69-.7-.46.03-.63.46-.7.7h-.2V6.95c0-1.16-.1-1.49-.76-1.59v-.27l3.16-.7h.23v17.07c.6-3.85,2.29-9.1,6.94-9.1,2.72,0,6.04,2.32,6.14,6.54Zm-2.56-.46c-.17-2.89-2.23-6.04-5.05-5.48-3.75.73-5.48,7.67-5.48,10.46v4.62c.17.07.93.33,1.99.3,3.19-.03,9-1.43,8.54-9.9Z" />
                                        <g>
                                            <path class="cls-1"
                                                d="m132.24,8.11c0-.86.7-1.56,1.56-1.56s1.56.7,1.56,1.56-.7,1.56-1.56,1.56-1.56-.7-1.56-1.56Z" />
                                            <path class="cls-1"
                                                d="m148.04,28.1v.23h-4.12v-.23c.53-.3.66-.86.56-1.96s-.6-6.71-.76-8.44c-.23-2.49-1.46-5.31-4.32-4.75-3.72.73-4.42,7.67-4.42,10.46v2.72c0,1.16.23,1.66.76,1.96v.23h-4.12v-.23c.5-.3.73-.8.73-1.96v-11.23c0-1.16-.1-1.49-.73-1.59v-.23l3.12-.73h.23v8.24c.43-3.72,1.56-8.24,5.88-8.24,2.72,0,5.05,1.86,5.45,5.85.33,3.22.66,6.71.8,7.94.13,1.2.43,1.66.93,1.96Z" />
                                        </g>
                                        <path class="cls-1"
                                            d="m90.5,12.32c-.2-.02-.4-.03-.62-.02-2.55.02-3.72,2.59-4.29,5.54-.21.91-.34,1.85-.43,2.74l-.12-16.21h-.26s-3.12.72-3.12.72v.26c.67.09.77.43.78,1.59l.14,19.19c0,.51-.04.89-.13,1.18,0,.04-.03.08-.04.12-.07.19-.18.34-.31.47-.05.05-.11.09-.17.14-.03.02-.07.04-.1.06h0c0,.07,0,.23,0,.23h0s4.12-.02,4.12-.02h0s0-.16,0-.23h0s-.06-.04-.09-.06c-.06-.04-.11-.09-.17-.14-.12-.12-.23-.27-.3-.46-.01-.04-.03-.08-.04-.12-.09-.29-.14-.67-.14-1.18v-1.29c-.02-1.39.06-4.17.55-6.7.24-1.29.58-2.51,1.07-3.45.41-.81.94-1.41,1.58-1.66.13-.05.26-.09.4-.11.22-.03.42-.03.62.01,1.39.29,2.13,2.38,2.2,4.05l.24.13,1.38-1.98.62-.89c-1.01-1.16-1.92-1.78-3.35-1.91Z" />
                                        <g>
                                            <path class="cls-1"
                                                d="m74.41,30.47c-1.69.07-3.75,1.8-6.21,3.25-2.13,1.3-4.05,2.59-5.74,2.56-1.23,0-1.8-.79-1.86-1.89-.11-1.29.94-2.08,2.28-2.49h0l.55-.32c-.27.05-.54.1-.81.17-1.95.48-3.87,1.5-3.81,3.07.03,1.53,1.36,2.16,3.12,2.03,1.56-.1,3.22-.96,4.75-1.89.8,1.1,1.96,2.39,4.35,2.39,2.82,0,6.14-1.69,6.14-4.32,0-1.46-.76-2.59-2.76-2.56Zm.73,3.12c-.13,2.19-1.56,3.56-4.12,3.52-2.46-.03-3.49-1.4-4.12-2.33.5-.3,1-.6,1.5-.89,1.92-1.2,4.05-2.62,5.08-2.76,1.33-.2,1.73.93,1.66,2.45Z" />
                                            <path class="cls-1"
                                                d="m77.9,16.88l-1.61-2.83-1.54-.35,1.16-1.07-.02-3.26-2.82-1.65-1.5.47.47-1.5-1.65-2.82-3.26-.02-1.07,1.16-.34-1.54-2.84-1.62-2.83,1.62-.35,1.54-1.07-1.16-3.26.02-1.65,2.82.48,1.5-1.51-.47-2.82,1.65-.02,3.26,1.17,1.07-1.54.35-1.61,2.83,1.61,2.83,1.54.35-1.17,1.07.02,3.26,2.82,1.65,1.51-.47-.48,1.51,1.65,2.81,3.26.02,1.07-1.16.35,1.54,2.57,1.47.26.15.55-.32h0l.21-.12h0l2.06-1.18.34-1.54,1.07,1.16,3.26-.02,1.65-2.81-.47-1.51,1.5.47,2.82-1.65.02-3.26-1.16-1.07,1.54-.35,1.61-2.83Zm-5.07-7.92l1.87,1.1v2.17s-1.59,1.08-1.59,1.08l-3.33-.4,1.32-3.09,1.74-.85Zm-4.01,12.13l1.07,2.8-2.81-1.07.18-1.54,1.56-.19Zm0-8.4l-1.54-.18-.18-1.57,2.8-1.07-1.08,2.82Zm.06,5.81l1.26-.94,2.32,1.89-2.97.48-.61-1.43Zm1.25-2.28l-1.24-.93.62-1.45,2.96.47-2.34,1.9Zm-2.58-11.17h2.17s1.1,1.89,1.1,1.89l-.86,1.74-3.09,1.32-.4-3.33,1.08-1.61Zm-1.61,5.23l-1.43.61-.94-1.26,1.89-2.33.48,2.98Zm-4.93-5.98l1.88-1.07,1.89,1.07.13,1.93-2.02,2.69-2.01-2.69.13-1.93Zm-.68,3l1.9,2.34-.93,1.25-1.45-.63.48-2.96Zm-4.26-2.24h2.17s1.08,1.59,1.08,1.59l-.4,3.33-3.09-1.32-.85-1.74,1.1-1.87Zm2.43,16.2l.18,1.57-2.8,1.07,1.11-2.91-.03.1,1.54.18Zm-2.85-3.72l1.24.93-.62,1.45-2.96-.47,2.34-1.9Zm-.01-1.34l-2.32-1.9,2.97-.47.62,1.42-1.27.95Zm1.31-3.54l-1.07-2.8,2.82,1.07h0s-.18,1.54-.18,1.54l-1.57.19Zm-5.88-2.61l1.87-1.1,1.74.85,1.32,3.09-3.33.4-1.61-1.08v-2.17Zm-.76,8.71l-1.07-1.88,1.07-1.89,1.93-.13,2.69,2.01-2.69,2.01-1.93-.13Zm2.63,6.04l-1.87-1.1v-2.17s1.59-1.08,1.59-1.08l3.33.4-1.32,3.09-1.74.85Zm5.3,3.92h-2.17s-1.1-1.89-1.1-1.89l.85-1.74,3.09-1.32.4,3.33-1.08,1.61Zm1.61-5.23l1.42-.61.95,1.26.07-.09-.97-1.3.97,1.3-.08.09-1.89,2.33-.48-2.98Zm4.93,6.12l-1.89,1.07-1.88-1.07-.14-2.06,2.02-2.69,2.02,2.69-.14,2.06Zm.68-3.14l-1.9-2.34.93-1.24,1.44.62-.48,2.96Zm.52-6.49l-.21,1.9-1.75-.77-1.13,1.54-1.13-1.54-1.75.77-.21-1.9-1.9-.21.77-1.75-1.54-1.13,1.54-1.13-.77-1.75,1.9-.21.21-1.9,1.75.77,1.13-1.54,1.13,1.54,1.75-.77.21,1.9,1.9.21-.77,1.75,1.54,1.13-1.54,1.13.77,1.75-1.9.21Zm4.9,6.98l-.91-1.85h-.01s.85,1.73.85,1.73l-1.09,1.87h-2.17s-1.08-1.59-1.08-1.59l.4-3.33,3.09,1.32h.02s.91,1.86.91,1.86h0Zm3.83-3.25l-1.87,1.1-1.74-.85-1.32-3.09,3.33-.4,1.6,1.08v2.17Zm-1.17-4.81l-2.69-2.01,2.69-2.01,1.93.13,1.07,1.88-1.07,1.89-1.93.13Z" />
                                        </g>
                                    </svg>
                                </a>
                            </div>
                            <p style="font-size:1.1em">Hi,</p>
                            <p>
                                We received a request to reset your Account password.
                                Enter the following password reset code:
                            </p>
                            <h2
                                style="background: #655445;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">
                                ${otp}
                            </h2>
                            <p style="font-size:0.9em;">Regards,<br />Maghrebin</p>
                            <hr style="border:none;border-top:1px solid #eee" />
                            <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                                <p>Maghrebin</p>
                                <p>Morocco</p>
                            </div>
                        </div>
                    </div>
            `,
        };


        

        

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                res.status(500).json({
                    message:'Email sent successfully'
                });
            } else {
                res.status(200).json({
                    message:'Email sent successfully'
                });
            }
        });

    } catch (error) {
        throw error
        return res.json(internalError());
    }
}


const checkOtp = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const { email, otpCode } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                error: `User with (${email}) not found`
            });
        }

        // Find the OTP verification record for the user
        const otpVerification = await UserOtpVerefication
            .findOne( { userId: user._id })
            .sort({ createAt: -1 }) // Sort in descending order (newest first)
            .limit(1);


        if((otpVerification && otpVerification.otp != otpCode) || !otpVerification){
            return res.status(400).json({
                error: 'Invalid OTP. Please enter the correct OTP.'
            });
        }
        
        if (diffetenceBetweenDateInMinutes(otpVerification.createAt) > 5) {
            return res.status(400).json({
                error: 'OTP has expired. Please request a new OTP.'
            });
        }

        

        
        // OTP is valid, so generate a JWT token
        const payload = { userId: otpVerification.userId };
        const secretKey = process.env.JWT_SECRET;
        const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
        
        
        // Update the OTP verification record to mark it as validated
        otpVerification.isvalidate = true;
        otpVerification.resetToken = token;
        await otpVerification.save();

        // You can now proceed with the password reset process or any other action you need.

        return res.status(200).json({
            message: 'OTP verified successfully',
            token: token
        });

    } catch (error) {
        throw error
        return res.json(internalError());
    }
}

const changePassword = async (req, res) => {
    
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }
        // Get the token from the request headers
        
        const token = req.headers.authorization.replace('Bearer ', '');
        // Verify the token and extract the user ID
        const secretKey = process.env.JWT_SECRET;
    
        let decoded;
        try {
            
            decoded = jwt.verify(token, secretKey);
        } catch (error) {
            return res.status(401).json({
                message: "Token expired"
            });
        }
        // Verify the token
        
        const otpVerification = await UserOtpVerefication
                                    .findOne({ userId: decoded.userId })
                                    .sort({ createAt: -1 }) // Sort in descending order (newest first)
                                    .limit(1);
        if(otpVerification.resetToken !== token){
            return res.status(401).json({
                message: "Invalid Token"
            });
        }

        if(req.body.password !== req.body.confirmation_password)
        {
            return res.status(401).json({
                message: "Confirmation password incorrect"
            });
        }
        
        
        
        
        // Extract the user ID
        const userId = decoded.userId;
        
        
        // Find the user by ID
        const user = await User.findOne({ _id: userId });
        
        if (!user) {
            return res.status(404).json({
                error: `User with ID (${userId}) not found`,
            });
        }
        
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        user.password = hashedPassword;
        
        await user.save();
    
        // You can also send a success response to indicate that the password has been updated.
        return res.status(200).json({
          message: 'Password changed successfully',
        })  ;
      } catch (error) {
        throw error
        return res.json(internalError());
      }
}
module.exports = { checkEmail, checkOtp, changePassword, inputsValidates, checkOtpInput, changePasswordInputs }