const mongoose = require('mongoose');


const categorieSchema = new mongoose.Schema(
    {
        categorieName: {
            type: String,
            require: true,
            unique: true
        },
        active:{
            type: Boolean,
            require:true,
            default: true
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
);

categorieSchema.methods.softDelete = async function(){
    try {
        this.deletedAt = new Date();
        await  this.save();
    } catch (error) {
        console.error('Error while removing the role:', error);
        throw error;
    }
}

const Categorie = mongoose.model('Categorie', categorieSchema, 'categories');
module.exports = Categorie;