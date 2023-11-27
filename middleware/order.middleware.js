const { validationResult, check } = require("express-validator");
const { internalError } = require("../utils/500");
const Order = require("../models/order.model");

// Middleware for validating request body
const validateUpdateOrder = async (req, res, next) => {
  try {
    await Promise.all([
      check("order_items")
        .isArray()
        .withMessage("Order items must be an array")
        .run(req),
      check("cart_total_price")
        .isNumeric()
        .withMessage("Cart total price must be a numeric value")
        .run(req),
      check("status")
        .notEmpty()
        .withMessage("Status is required")
        .isIn(["pending", "processed", "shipped"])
        .withMessage("Invalid status")
        .run(req),
    ]);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    next();
  } catch (error) {
    res.json(internalError("", error)); // Handle internal server error
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
      check("product_id")
        .notEmpty()
        .withMessage("Product ID is required")
        .isMongoId()
        .withMessage("Invalid product ID format")
        .run(req),
      check("quantity")
        .notEmpty()
        .withMessage("Quantity is required")
        .isInt({ min: 1 })
        .withMessage("Quantity must be a positive integer")
        .run(req),
      check("price")
        .notEmpty()
        .withMessage("Price is required")
        .isNumeric()
        .withMessage("Price must be a numeric value")
        .run(req),
      check("cart_total_price")
        .optional()
        .isNumeric()
        .withMessage("Cart total price must be a numeric value")
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
  validateUpdateOrder,
  validateOrderId,
};
