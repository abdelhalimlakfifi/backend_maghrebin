const mongoose = require('mongoose');

const productImage = new mongoose.Schema(
    {
        path: {
            type:String,
            require: true
        },
        main: {
            type:Boolean,
            required: true
        },
        secondary: {
            type: Boolean,
            required: true
        },
    },{
        timestamps: true
    }
)


const ProductImage = mongoose.model('ProductImage', productImage, "product_images");

module.exports = ProductImage;