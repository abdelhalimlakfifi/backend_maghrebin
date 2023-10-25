const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
    {
        role: { 
            type: String, 
            required: true,
            unique: true
        },
        permissions: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Permission'
            }
        ],
    },{
        timestamps: true
    }
);



const Role = mongoose.model('Role', roleSchema, 'roles')
module.exports = Role;