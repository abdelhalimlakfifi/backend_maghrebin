
const User = require('../../models/user.model');
const { internalError } = require('../../utils/500'); // Import a custom internalError function.
const { check, body, validationResult } = require('express-validator'); // Import express-validator for input validation.
const mongoose = require('mongoose'); // Import mongoose for working with MongoDB.
const multer = require('multer');
const {uploadFileFunction} = require('../../utils/uploadFile');



const store = async (req, res) => {
    try {
        const uploadedFile = await uploadFileFunction(req, res, 'profile_picture');
        await Promise.all([
            check('username').notEmpty().withMessage('Username is required').run(req),
            check('email').isEmail().withMessage('Invalid email format').run(req),
            check('fullname').notEmpty().withMessage('Fullname is required').run(req),
            check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long').run(req),
        ]);


        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        res.json();
    } catch (error) {
        // Handle errors
        // throw error
        res.status(500).json({
            error: error
        });
    }
};


const getOne = async (req, res) => {

}



const search = async( req, res) => {

}


const update = async( req, res) => {
    
}



const destroy = async( req, res) => {
    
}
const index = async (req, res) => {
    try {

        const users = await User.find()
        .populate({
            path: 'role',
            populate: {
                path: 'permissions',
                model:'Permission',
                select: 'label'
            }
        })
        .exec();
        res.json(users);
    } catch (error) {
        res.json(internalError("", error))
    }
}

module.exports = { index, store, getOne, search, update, destroy };
