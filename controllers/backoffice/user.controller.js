const User = require('../../models/user.model');
const {
    internalError
} = require('../../utils/500'); // Import a custom internalError function.
const {
    body,
    validationResult
} = require('express-validator'); // Import express-validator for input validation.
const mongoose = require('mongoose'); // Import mongoose for working with MongoDB.
const multer = require('multer');



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// const upload = multer({ storage });



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
const upload = multer({
    storage
}).single('profile_picture'); // Assuming 'file' is the name attribute in the form


const store = async (req, res) => {
    try {


        console.log(req.body);
        upload(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading
                return res.status(500).json({
                    error: err.message
                });
            } else if (err) {
                // An unknown error occurred when uploading
                return res.status(500).json({
                    error: 'An unknown error occurred'
                });
            }

            console.log(req.body); // Access other form fields (JSON data)

            // Your file information is available in req.file
            const uploadedFile = req.file;

            // Continue with the rest of your controller logic
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array()
                });
            }

            // The rest of your logic...

            // Respond to the client
            res.json({
                message: 'File uploaded successfully',
                data: req.body,
                file: uploadedFile,
            });
        });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
};


const getOne = async (req, res) => {

}



const search = async (req, res) => {

}


const update = async (req, res) => {

}



const destroy = async (req, res) => {

}


module.exports = {
    index,
    store,
    getOne,
    search,
    update,
    destroy,
    upload,
    storingValidation
};