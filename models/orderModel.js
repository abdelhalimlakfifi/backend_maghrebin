const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
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
      price: { type: Number, required: true },
    },
  ],
  order_date: { timestamps: true }, // Date and time when the order was placed
  cart_total_price: { type: Number, required: true }, // Total price of the items in the cart
  // Status of the order (e.g., 'Pending', 'Shipped', 'Delivered', etc.)
  status: { type: String, required: true },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
