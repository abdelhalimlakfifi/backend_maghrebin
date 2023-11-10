const User = require('../../models/user.model');
const { internalError } = require('../../utils/500'); // Import a custom internalError function.
const { body, validationResult } = require('express-validator'); // Import express-validator for input validation.
const mongoose = require('mongoose'); // Import mongoose for working with MongoDB.
const multer = require('multer');



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now()+'-'+file.originalname);
    }
});

const upload = multer({ storage });



const storingValidation = [
    body('first_name').notEmpty(),
    body('last_name').notEmpty(),
    body('username').notEmpty(),
    body('password').notEmpty(),
    body('email').notEmpty(),
    body('role').notEmpty(),
    body('profile_picture')
];

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


const store = async (req, res) => {
    

    const x = await upload.single('profile_picture');
    console.log(req.body);
    console.log(x);
    res.json({
        test: "test"
    });
    return
   
   
   
   
   
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const foundedEmail = await User.findOne({ email:req.body.email });
        if(foundedEmail){
            if(foundedEmail.deletedAt != null){
                await foundedEmail.deleteOne();
            }else{
                return res.status(409).json({
                    status: 409,
                    message: "Email Already exist"
                });
            }
        }

        const foundedUsername = await User.findOne({ username: req.body.username });
        if(foundedUsername){
            if(foundedUsername.deletedAt != null){
                await foundedUsername.deleteOne();
            }else{
                return res.status(409).json({
                    status: 409,
                    message: "Username Already exist"
                });
            }
        }

        
    } catch (error) {
        
    }
}


const getOne = async (req, res) => {

}



const search = async( req, res) => {

}


const update = async( req, res) => {
    
}



const destroy = async( req, res) => {
    
}


module.exports = { index, store, getOne, search, update, destroy, storingValidation };
