const { validationResult, check } = require("express-validator");
const { internalError } = require("../utils/500");
const Order = require("../models/order.model");

// Middleware for validating request body
const validateUpdateOrderStatus = async (req, res, next) => {
  try {
    await Promise.all([
      check("status")
        .notEmpty()
        .withMessage("Status is required")
        .isIn(["pending", "delivery", "delivered", "return"])
        .withMessage("Invalid status")
        .run(req),
    ]);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    next();
  } catch (error) {
    console.error("Error validating update order status request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// Middleware for validating request parameters
const validateOrderId = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    // console.log("orderId ",orderId)
    if (!/^[0-9a-fA-F]{24}$/.test(orderId)) {
      // Check if the order ID has a valid format
      return res.status(400).json({ error: "Invalid order ID format" });
    }

    // Check if the order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    next();
  } catch (error) {
    res.json(internalError("", error)); // Handle internal server error
  }
};
const validateProductDetails = async (req, res, next) => {
  try {
    await Promise.all([
      // Validate product_id
      check("product_id")
        .notEmpty()
        .withMessage("Product ID is required")
        .isMongoId()
        .withMessage("Invalid product ID format")
        .run(req),

      // Validate order_items
      check("order_items")
        .isArray()
        .withMessage("Order items must be an array")
        .notEmpty()
        .withMessage("Order items cannot be empty")
        .custom((value) => {
          // Validate each order item in the array
          value.forEach((item, index) => {
            if (!item.product_id) {
              throw new Error(
                `Product ID is required for order item ${index + 1}`
              );
            }
            if (
              !item.quantity ||
              item.quantity < 1 ||
              !Number.isInteger(item.quantity)
            ) {
              throw new Error(`Invalid quantity for order item ${index + 1}`);
            }
            if (!item.unit_price || typeof item.unit_price !== "number") {
              throw new Error(`Invalid price for order item ${index + 1}`);
            }
          });
          return true;
        })
        .run(req),
    ]);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors });
    }

    next();
  } catch (error) {
    res.json(internalError("", error)); // Handle internal server error
  }
};

module.exports = {
  validateProductDetails,
  validateUpdateOrderStatus,
  validateOrderId,
};
