const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const products = new Schema({
  product_image: {
    type: String,
  },
  product_name: {
    type: String,
  },
  subcategory_id: [{ type: String, ref: "Subcategory" }],
  short_description: {
    type: String,
  },
  long_description: {
    type: String,
  },
  price: {
    type: Number,
  },
  discount_price: {
    type: Number,
  },
  active: {
    type: Boolean,
    default: false,
  },
});
const Products = mongoose.model("Products", products);
module.exports = Products;
