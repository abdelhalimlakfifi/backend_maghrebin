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

        deletedAt:{
            type : Date ,
            default : null

        }
    },{
        timestamps: true
    }
);


roleSchema.methods.softDelete = async function () {
    try {
        // Set the 'deletedAt' field to the current date
        this.deletedAt = new Date();
        await this.save(); // Save the updated document
    } catch (error) {
        // Handle any errors that occur during the process
        console.error('Error while removing the role:', error);
        throw error;
    }
}


const Role = mongoose.model('Role', roleSchema, 'roles')
module.exports = Role;