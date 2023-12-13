const mongoose = require('mongoose');


const categorieSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: true,
            unique: true
        },
        typeId:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Type'
        }],
        image: {
            type: String,
            required: true
        },
        // active:{
        //     type: Boolean,
        //     require:true,
        //     default: true
        // },
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

categorieSchema.methods.softDelete = async function(userid){
    try {
        this.deletedAt = new Date();
        this.deletedBy = userid;
        await  this.save();
    } catch (error) {
        console.error('Error while removing the role:', error);
        throw error;
    }
}

const Categorie = mongoose.model('Categorie', categorieSchema, 'categories');
module.exports = Categorie;