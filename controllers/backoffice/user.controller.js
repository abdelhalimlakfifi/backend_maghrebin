
const User = require('../../models/user.model');
const Role = require('../../models/role.model');
const { internalError } = require('../../utils/500'); // Import a custom internalError function.
const { check, body, validationResult } = require('express-validator'); // Import express-validator for input validation.
const mongoose = require('mongoose'); // Import mongoose for working with MongoDB.
const multer = require('multer');
const {uploadFileFunction} = require('../../utils/uploadFile');
const bcrypt = require('bcrypt');



const store = async (req, res) => {
    try {
        const uploadedFile = await uploadFileFunction(req, res, 'profile_picture');
        await Promise.all([
            check('first_name')
            .notEmpty()
            .withMessage('First name is required')
            .run(req),
            check('last_name')
            .notEmpty()
            .withMessage('Last name is required')
            .run(req),
            check('username')
            .notEmpty()
            .withMessage('username is required')
            .run(req),
            check('email')
            .isEmail()
            .withMessage('email is required')
            .run(req),
            check('role')
            .notEmpty()
            .withMessage('role is required')
            .run(req),
            check('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long')
            .run(req),
        ]);


        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }


        const emailFounded = await User.findOne({ email: req.body.email});
        const usernameFounded = await User.findOne({ username: req.body.username});
        const role = await Role.findOne({ role: req.body.role });
        let alreadyError = [];

        if(emailFounded)
        {
            alreadyError.push({
                attribute: "email",
                error: "Email already exists"
            })
        }

        if(usernameFounded)
        {
            alreadyError.push({
                attribute: "username",
                error: "username already exists"
            });
        }

        if(!role){
            alreadyError.push({
                attribute: "role",
                error: "Role not exist"
            });
        }


        if(alreadyError.length > 0){
            return res.status(400).json({alreadyError})
        }


        let imagePath = null
        if(uploadedFile != undefined)
        {
            imagePath = uploadedFile.destination + uploadedFile.originalname
        }





        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email,
            role: role._id,
            profile_picture: imagePath,
            createdBy: req.user._id,
        })


        await user.save();
        return res.status(200).json({
            message: "User saved successfully",
            user: user
        });
    } catch (error) {
        // Handle errors
        // throw error
        res.status(500).json({
            error: error
        });
    }
};


const getOne = async (req, res) => {

    try {
        // Extract id from Query string

        const {
            id
        } = req.query;

        console.log(req.query)

         // Validate id
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                error: 'Invalid user ID'
            });
        }

         // Find user by ID
        const user = await User.findById(id)
            .populate('role', 'name permissions');

        console.log(user)

        // // Check if user exists
        // if (!user) {
        //     return res.status(404).json({
        //         error: 'User not found'
        //     });
        // }

        // // Return user
        // return res.status(200).json({
        //     user
        // });
    } catch (error) {
        // Handle errors
        return res.status(500).json({
            error: 'Something went wrong'
        });
    }

}



const search = async (req, res) => {
   
}


const update = async (req, res) => {

}



const destroy = async (req, res) => {

}



const index = async (req, res) => {
    try {

        const users = await User.find()
            .populate({
                path: 'role',
                populate: {
                    path: 'permissions',
                    model: 'Permission',
                    select: 'label'
                }
            })
            .exec();
        res.json(users);
    } catch (error) {
        res.json(internalError("", error))
    }
}

module.exports = {
    index,
    store,
    getOne,
    search,
    update,
    destroy
};