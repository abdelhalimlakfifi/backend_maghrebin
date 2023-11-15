const mongoose = require('mongoose');


const tagSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
            default: null
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null
        },
        deletedAt: {
            type: Date,
            default: null
        },
        deletedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null
        }
    },{
        timestamps: true
    }
);


tagSchema.methods.softDelete = async function(userId){
    try {
        this.deletedAt = new Date();
        this.deletedBy = userId;

        await this.save()
    }
    catch(err){
        console.error ('Error while removing the role:', err);
        throw err;
    }
}



const Tag = mongoose.model('Tag', tagSchema, 'tags');
module.exports = Tag;