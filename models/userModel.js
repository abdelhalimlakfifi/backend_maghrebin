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
        required: true
    },
    profile_picture: {
        type: String,
        default: null
    },
    categories_clicks: [{
        categorie_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category'
        },
        count: {
            type: Number
        }
    }],
    login_history: [{
        ip: {
            type: String,
            required: false
        },
        device: {
            type: String,
            required: false
        },
        browser: {
            type: String,
            required: false
        },
        os: {
            type: String,
            required: false
        },
        created_at: {
            type: Date,
            required: false
        }
    }],
    valid_account: {
        type: Boolean,
        default: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    updated_at: {
        type: Date,
        default: null
    },
    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    deleted_at: {
        type: Date,
        default: null
    },
    deleted_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;