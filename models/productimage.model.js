const mongoose = require("mongoose");

const productImage = new mongoose.Schema(
  {
    path: {
      type: String,
      require: true,
    },
    main: {
      type: Boolean,
      required: true,
    },
    secondary: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

productImage.methods.softDelete = async function (userid) {
  try {
    this.deletedAt = new Date();
    this.deletedBy = userid;
    await this.save();
  } catch (error) {
    console.error("Error while removing the role:", error);
    throw error;
  }
};

const ProductImage = mongoose.model(
  "ProductImage",
  productImage,
  "product_images"
);

module.exports = ProductImage;
