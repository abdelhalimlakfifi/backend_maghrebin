// wishlistModel.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const wishlistSchema = new Schema({
  customer: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  // if i want to get all products info
  // products: [{
  //     type: Schema.Types.Mixed  // Store the entire product object
  // }]
});

const Wishlist = mongoose.model("Wishlist", wishlistSchema);

module.exports = Wishlist;
