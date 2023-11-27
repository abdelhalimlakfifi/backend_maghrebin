const Order = require("../../models/order.model");
const Product = require("../../models/product.model");
const { internalError } = require("../../utils/500"); // Import internalError utility function

const create = async (req, res) => {
  try {
    // TODO : ID of customer and get the product id after verifications of customer account
    // const id = req.customer._id;
    const id = "655fb40d275a49940fa7dadb";
    // Extract product_id  from params
    const { product_id, quantity, price, cart_total_price } = req.query;
    // console.log("product_id ", product_id);
    // console.log("price ", price);
    // console.log("quantity ", quantity);

    const existingProduct = await Product.findOne({ _id: product_id });

    if (!existingProduct) {
      // If the product_id is not found, return an error
      return res.status(404).json({ message: "Product not found" });
    }
    // Create a new order
    const newOrder = new Order({
      customer_id: id,
      order_items: [
        {
          product_id: product_id,
          quantity,
          price,
        },
      ],
      order_date: new Date(),
      cart_total_price,
      // the satus of the order
      status: "Pending",
    });

    const savedOrder = await newOrder.save();

    res.status(200).json({ message: "Order created successfully", savedOrder });
  } catch (error) {
    res.json(internalError("", error)); // Handle internal server error
  }
};

const search = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Error searching for order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller for updating an order
const update = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { order_items, cart_total_price, status } = req.body;

    // Find the order by ID
    const orderToUpdate = await Order.findOne({ _id: orderId });

    if (!orderToUpdate) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Update the fields
    orderToUpdate.order_items.quantity = order_items.quantity; // Replace with the desired quantity
    orderToUpdate.order_items.price = order_items.price;
    orderToUpdate.cart_total_price = cart_total_price;
    orderToUpdate.status = status;

    // Save the updated order
    const updatedOrder = await orderToUpdate.save();

    res.status(200).json({ success: true, order: updatedOrder });
  } catch (error) {
    res.json(internalError("", error)); // Handle internal server error
  }
};

const getAll = async (req, res) => {
  try {
    console.log("getAll called");
    const orders = await Order.find();
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error getting all orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const deletedOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    // Delete the order by ID
    const deletedOrder = await Order.findByIdAndDelete({ _id: orderId });

    if (!deletedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res
      .status(200)
      .json({
        message: "order delete success",
        success: true,
        order: deletedOrder,
      });
  } catch (error) {
    res.json(internalError("", error)); // Handle internal server error
  }
};

module.exports = {
  create,
  search,
  update,
  deletedOrder,
  getAll,
};
