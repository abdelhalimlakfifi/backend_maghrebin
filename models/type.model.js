const mongoose = require('mongoose');


const typeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: true
        },

        active: {
            type: Boolean,
            require:true,
            default: true 
        },
        image: {
            type: String,
            require: true
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref:'User'
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
    }
    
)


typeSchema.methods.softDelete = async function(userid){
    try {
        this.deletedAt = new Date();
        this.deletedBy = userid;
        await  this.save();
    } catch (error) {
        console.error ('Error while removing the role:', error);
        throw error;
    }
}


const Type = mongoose.model('Type', typeSchema,'types')
module.exports = Type;