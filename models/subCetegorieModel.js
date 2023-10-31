const mongoose = require('mongoose');

const subCategorieSchema = new mongoose.Schema(
    {
        name: {
            type:String,
            require: true
        },
        typeId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Type'
        },

        categorieId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Categorie'
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
)