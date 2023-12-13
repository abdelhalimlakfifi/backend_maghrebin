const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  id: { type: String, required: true },
  ref: { type: String, required: true },
  images: [
    {
      image_path: { type: String, required: true },
      main: { type: Boolean, required: true },
    },
  ],
  deleted: { type: Boolean, default: false }, 
  deletedAt: { type: Date, default: null }, 
});

productSchema.pre('save', function (next) {
  if (this.deleted) {
    this.deletedAt = new Date(); 
  }
  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
