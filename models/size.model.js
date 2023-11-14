const mongoose = require('mongoose');
const sizeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: true,
            unique: true
        },
        abreveation: {
            type: String,
            default: null
        },
        description:{
            type: String,
            default: null
        },
        bust:{
            type: Number,
            default: null
        },
        waist:{
            type: Number,
            default: null
        },
        hips:{
            type: Number,
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
    },
    {
        timestamps: true
    }
)


const Size = mongoose.model('Size', sizeSchema, 'sizes')

module.exports = Size;