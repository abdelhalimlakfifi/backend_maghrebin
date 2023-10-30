const mongoose = require('mongoose');

const subCategorie = new mongoose.Schema(
    {
        name:{
            type:String,
            require: true
        },
        active:{
            type: Boolean,
            require:true,
            default: true
        },

        type:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:'Type'
            }
        ],
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


const SubCategorie = mongoose.model('SubCategorie', subCategorie, 'sub_cetegories')
module.exports = SubCategorie;