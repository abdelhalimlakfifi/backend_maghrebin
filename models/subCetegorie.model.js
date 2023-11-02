const mongoose = require('mongoose');

const subCategorieSchema = new mongoose.Schema(
    {
        name: {
            type:String,
            require: true
        },
        typeId:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Type'
        }],

        categorieId: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Categorie'
        }],
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


subCategorieSchema.methods.softDelete = async function(userid){
    try {
        this.deletedAt = new Date();
        this.deletedBy = userid;
        await  this.save();
    } catch (error) {
        console.error('Error while removing the role:', error);
        throw error;
    }
}


const SubCategorie = mongoose.model('SubCategorie', subCategorieSchema,"sub_cetegories");

module.exports = SubCategorie;