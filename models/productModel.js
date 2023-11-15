const mongoose = require("mongoose");


const productSchema = new mongoose.Schema({
    ref: {
        type: String,
        required: true
    },
    images: [{
        image_path: {
            type: String,
            required: true
        },
        main: {
            type: Boolean,
            required: true
        },
        secondary: {
            type: Boolean,
            required: true
        }
    }],
    title: {
        type: String,
        required: true
    },
    short_description: {},
    long_description: {},
    price: {},
    short_description: {},
    reviews: [{}],

    createdBy: {},
    updatedBy: {},
    deletedBy: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    },
},
{
    timestamps: true
});

productSchema.pre('save', function (next) {
    if (this.deleted) {
        this.deletedAt = new Date();
    }
    next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;