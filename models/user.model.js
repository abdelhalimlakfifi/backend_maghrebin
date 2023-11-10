const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        //type: String, // just for testing
        required: true
    },
    profile_picture: {
        type: String,
        default: null
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        default : null

    },
    updatedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        default : null
    },
    deletedAt:{
        type : Date ,
        default : null
    },
    deletedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        default : null
    }
},{
    timestamps: true
});




const User = mongoose.model('User', userSchema, "users");

module.exports = User;