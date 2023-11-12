const User = require('../../models/user.model');
const Role = require('../../models/role.model');
const {
    internalError
} = require('../../utils/500'); // Import a custom internalError function.
const {
    check,
    body,
    validationResult
} = require('express-validator'); // Import express-validator for input validation.
const mongoose = require('mongoose'); // Import mongoose for working with MongoDB.
const multer = require('multer');
const {
    uploadFileFunction
} = require('../../utils/uploadFile');
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
            .isLength({
                min: 6
            })
            .withMessage('Password must be at least 6 characters long')
            .run(req),
        ]);


        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }


        const emailFounded = await User.findOne({
            email: req.body.email
        });
        const usernameFounded = await User.findOne({
            username: req.body.username
        });
        const role = await Role.findOne({
            role: req.body.role
        });
        let alreadyError = [];

        if (emailFounded) {
            alreadyError.push({
                attribute: "email",
                error: "Email already exists"
            })
        }

        if (usernameFounded) {
            alreadyError.push({
                attribute: "username",
                error: "username already exists"
            });
        }

        if (!role) {
            alreadyError.push({
                attribute: "role",
                error: "Role not exist"
            });
        }


        if (alreadyError.length > 0) {
            return res.status(400).json({
                alreadyError
            })
        }


        let imagePath = null
        if (uploadedFile != undefined) {
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
        // Extract username from params 
        const {
            username
        } = req.params;

        console.log(req.params)

        // Find user by username
        const user = await User.findOne({
                username
            })
            .populate({
                path: 'role',
                populate: {
                    path: 'permissions'
                }
            });

        console.log(user)

        // Check if user exists
        if (!user) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        // Return user
        return res.status(200).json({
            user
        });

    } catch (error) {
        // Handle errors
        console.error(error);
        return res.status(500).json({
            error: 'Error finding user'
        });
    }

    //Further improvement:
    // Input validation on username
    // Rate limiting to avoid DoS attacks
    // Select projection to return only needed fields

}



const search= async (req, res) => {
    try {
        const { firstName, username, email, lastName, role } = req.query;

        // Building the filter object based on the provided parameters
        const filter = {};

        // Use a case-insensitive regex to match any part of the query
        if (role && mongoose.Types.ObjectId.isValid(role)) {
            filter.role = new mongoose.Types.ObjectId(role);
        }


        // Adding other parameters to the filter
        if (username) {
            filter.username = { $regex: new RegExp(username, 'i') };
        }
        if (email){
            filter.email = { $regex: new RegExp(email, 'i') };
        } 
        if (lastName){
            filter.last_name = { $regex: new RegExp(lastName, 'i') };
        } 
        if (firstName){
            filter.first_name = { $regex: new RegExp(firstName, 'i') };
        } 

        console.log('Filter:', filter);


        // Querying the database
        const users = await User.find(filter);

        console.log(users);
        res.json({ success: true, users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


// Update all fields even the profile pic
// Matnsaych l UpdatedBy
// Kolshi illa password

const update = async (req, res) => {

}


// SoftDelete

const destroy = async (req, res) => {

    const username = req.params.username;

    console.log(username)
    console.log('Authenticated User:', req.user);


    let user = await User.findOne({ username: username });

    console.log('Found User:', user);

    if(!user){
        return res.status(404).json({
            status: 404,
            message: "user not found"
        });
    }


    await user.softDelete(req.user._id);
        res.json({
            status: 200,
            message: "User deleted successfully",
        });

}


const passwordChanger = async (req, res) => {
    
    try {
        const { username, newPassword, confirmNewPassword } = req.body;

        console.log(req.body)

        if (newPassword !== confirmNewPassword) {
            return res.status(401).json({ success: false, message: ' passwords are unmatched' });
        } 
            
        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Find the user by username
        const user = await User.findOne({username: username});
       
        // Check if the user exists
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Update the user's password and record who changed it
        user.password = hashedNewPassword;
        

        // Save the updated user in the database
        await user.save();

        res.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
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
    passwordChanger,
    destroy
};