const mongoose = require("mongoose");
// Define the formatting options
const options = {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  timeZoneName: "short",
};
const orderSchema = new mongoose.Schema(
  {
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Customer",
    },
    order_items: [
      {
        product_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        unit_price: { type: Number, required: true },
        sum_price: { type: Number, required: true },
      },
    ],
    ref: {
      type: Number,
      unique: true, // Ensure uniqueness of the ref field
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },

    // TODO : {
    //   timestamps: true
    // }
    cart_total_price: { type: Number, required: true }, // Total price of the items in the cart
    // Status of the order (e.g., 'Pending', 'Shipped', 'Delivered', etc.)
    status: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        // Transform the timestamps to a more readable format
        ret.createdAt = new Date(ret.createdAt).toLocaleString(
          "en-US",
          options
        );
        ret.updatedAt = new Date(ret.updatedAt).toLocaleString(
          "en-US",
          options
        );
        delete ret.__v; // Optionally remove the __v field
        return ret;
      },
    },
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
