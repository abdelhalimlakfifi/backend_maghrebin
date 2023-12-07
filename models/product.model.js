const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
      ref: {
        type: String,
        default: null,
        unique: true,
      },
    images: [
      {
        image_path: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ProductImage",
          required: true,
        },
        colors: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Color",
          required: true,
        },
      },
    ],
    title: {
      type: String,
      required: true,
    },
    short_description: {
      type: String,
      required: true,
    },
    long_description: {
      type: String,
      default: null,
    },
    price: {
      type: Number,
      required: true,
    },
    reviews: [
      {
        rating: {
          type: Number,
          required: true,
        },
        customer: {
          type: String, // Assuming a reference to the Customer model
          required: true,
        },
      },
    ],

    types: [
      {
        type: mongoose.Schema.Types.ObjectId, // Assuming a reference to the Types model
        ref: "Types",
        required: true,
      },
    ],
    categories_id: {
      type: mongoose.Schema.Types.ObjectId, // Assuming a reference to the Category model
      ref: "Categorie",
      required: true,
    },
    sub_categorie_id: {
      type: mongoose.Schema.Types.ObjectId, // Assuming a reference to the SubCategory model
      ref: "SubCategorie",
      required: true,
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId, // Assuming a reference to the Tags model
        ref: "Tags",
        required: true,
      },
    ],
    sizes: [
      {
        type: mongoose.Schema.Types.ObjectId, // Assuming a reference to the Sizes model
        ref: "Sizes",
        required: true,
      },
    ],
    colors: [
      {
        type: mongoose.Schema.Types.ObjectId, // Assuming a reference to the Colors model
        ref: "Colors",
        required: true,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId, // Assuming a reference to the User model
      ref: "User",
      required: true,
    },
    updateLogs: [
      {
        field: String,
        oldValue: String,
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        updatedAt: {
          type: Date,
        },
      },
    ],
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId, // Assuming a reference to the User model
      ref: "User",
      default: null,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
