const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const connectDB = require('../config/db');
const User = require('../models/user');

connectDB();

const addDynamicUser = async (userData) => {
    try {
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const newUser = new User({
            first_name: userData.first_name,
            last_name: userData.last_name,
            username: userData.username,
            password: hashedPassword,
            email: userData.email,
            role: userData.role,
            profile_picture: userData.profile_picture,
            categories_clicks: userData.categories_clicks,
        });

        await newUser.save();

        console.log('User added successfully');
    } catch (error) {
        console.error(`Error adding user: $ {
            error.message
        }`);
    } finally {
        mongoose.connection.close();
    }
};

const [, , username, password, role, email, first_name, last_name, profile_picture, categories_clicks] = process.argv;

if (username && password && role && email) {
    const userData = {
        first_name,
        last_name,
        username,
        password,
        email,
        role,
        profile_picture: profile_picture || null,
        categories_clicks: categories_clicks ? JSON.parse(categories_clicks) : null,
    };

    addDynamicUser(userData);
} else {
    console.error('Please provide username, password, role, and email');
    mongoose.connection.close();
}