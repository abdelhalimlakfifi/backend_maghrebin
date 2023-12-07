const express = require("express");
const Order = require("../../controllers/frontoffice/order.controller");
const {
  validateOrderId,
  validateProductDetails,
  validateUpdateOrderStatus,
} = require("../../middleware/order.middleware");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const {
  authenticateToken,
  Customer_authenticateToken,
} = require("../../middleware/authMiddleware");
const ordersRoutes = express.Router();
// create order
ordersRoutes.post(
  "/order",
  Customer_authenticateToken,
  validateProductDetails,
  Order.create
);
// get all orders
ordersRoutes.get("/all", Order.getAll);
// get order by id
ordersRoutes.get("/:id", authenticateToken, validateOrderId, Order.search);
// update the status of order
ordersRoutes.post(
  "/:id",
  upload.any(),
  authenticateToken,
  validateUpdateOrderStatus,
  Order.update
);
// Delete order route
ordersRoutes.delete("/:id",authenticateToken, validateOrderId, Order.deletedOrder);
module.exports = ordersRoutes;
