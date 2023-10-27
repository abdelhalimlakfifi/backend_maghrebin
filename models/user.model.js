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
    categories_clicks: [{
        categorie_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category'
        },
        count: {
            type: Number
        }
    }],
});


userSchema.methods.hasPermission = async (per) => {

    await this.populate('role', 'permissions').execPopulate();

    // Check if the user's role has the specified permission
    const role = this.role;
    if (!role) {
        return false; // If the user doesn't have a role, they have no permissions
    }

    // Loop through the role's permissions and check if any match the given permissionName
    for (const permission of role.permissions) {
        if (permission.name === per) {
            return true; // User has the specified permission
        }
    }

    return false;
}


const User = mongoose.model('User', userSchema, "users");

module.exports = User;