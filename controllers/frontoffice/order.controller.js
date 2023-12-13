const Customer = require("../../models/customer.model");
const Order = require("../../models/order.model");
const Product = require("../../models/product.model");
const { internalError } = require("../../utils/500"); // Import internalError utility function
const sendEmail = require("../../utils/email/sendEmail");

const create = async (req, res) => {
  try {
    // TODO : ID of customer and get the product id after verifications of customer account
    const id = req.customer._id;
    const customer = await Customer.findById(id);

    // const { product_id, order_items } = req.body;
    const { address, postalCode, city, order_items } = req.body;

    // const existingProduct = await Product.findOne({ _id: order_items.product_id });

    // if (!existingProduct) {
    //   // If the product_id is not found, return an error
    //   return res.status(404).json({ message: "Product not found" });
    // }

    const ref = Math.floor(100000 + Math.random() * 900000);
    // Calculate cart_total_price
    const cart_total_price = order_items.reduce((total, item) => {
      return total + item.quantity * item.unit_price;
    }, 0);
    // Create a new order
    const newOrder = new Order({
      customer_id: id,
      order_items: order_items.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        sum_price: item.quantity * item.unit_price,
      })),
      cart_total_price,
      address,
      postalCode,
      city,
      ref,
      // the status of the order
      status: "Pending",
    });

    const savedOrder = await newOrder.save();
    // Activate account here
    sendEmail(
      customer.email,
      "Maghribian Order ",
      {
        name: customer.first_name + " " + customer.last_name,
        ref,
        order_items,
      },
      "../../utils/email/templates/requestOrderCustomer.handlebars"
    );
    res.status(200).json({ message: "Order created successfully", savedOrder });
  } catch (error) {
    res.json(internalError("", error)); // Handle internal server error
  }
};

const search = async (req, res) => {
  try {
    const customer_id = req.params.id;
    console.log("customer_id ", customer_id);
    const order = await Order.find({ customer_id }).populate(
      "order_items.product_id",
      "ref"
    );
    if (!order.length) {
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
    // console.log("request body", req.body);
    const { status } = req.body;
    console.log("orderId ", orderId);
    console.log("status ", status);
    // Find and update the order status
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Update the status field
    order.status = status;

    // Save the updated order
    const updatedOrder = await order.save();

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

    res.status(200).json({
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
