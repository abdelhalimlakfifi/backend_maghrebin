const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const connectDB = require('../config/db');
const User = require('../models/user.model');
const Role = require('../models/role.model');


connectDB();

const addDynamicUser = async () => {
    try {
        const hashedPassword = await bcrypt.hash('password', 10);

        const admin = await Role.findOne({ role: 'admin' });
        // console.log(admin, admin._id);
        const newUser = new User({
            first_name: 'admin',
            last_name: 'admin',
            username: 'admin',
            password: hashedPassword,
            email: 'admin@mail.com',
            role: admin._id ,
            profile_picture: null,
            categories_clicks: [],
        });

        await newUser.save();

        console.log('User added successfully');
    } catch (error) {
        console.error(`Error adding user: ${
            error.message
        }`);
    } finally {
        mongoose.connection.close();
    }
};


addDynamicUser()
// const [, , username, password, role, email, first_name, last_name, profile_picture, categories_clicks] = process.argv;

// if (username && password && role && email) {
//     const userData = {
//         first_name,
//         last_name,
//         username,
//         password,
//         email,
//         role,
//         profile_picture: profile_picture || null,
//         categories_clicks: categories_clicks ? JSON.parse(categories_clicks) : null,
//     };

//     addDynamicUser(userData);
// } else {
//     console.error('Please provide username, password, role, and email');
//     mongoose.connection.close();
// }