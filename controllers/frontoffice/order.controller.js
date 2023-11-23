const Order = require("../models/Order");
const Customer = require("../../models/customer.model");

const createOrder = async (req, res) => {
  try {
    // TODO : ID of customer and get the product id after verifications of user account
    const id = null;
    // Create a new order
    const newOrder = new Order({
      customer: id,
      status: "open", // Default status is open
      orderDate: new Date(), // Update order date when created
      // Add other fields as needed
    });

    const savedOrder = await newOrder.save();
    res.json(savedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createOrder,
};
