const express = require("express");
const Order = require("../../controllers/frontoffice/order.controller");
const {
  validateOrderId,
  validateProductDetails,
  validateUpdateOrderStatus,
} = require("../../middleware/order.middleware");
const { authenticateToken } = require("../../middleware/authMiddleware");
const ordersRoutes = express.Router();
// create order
ordersRoutes.post("/order", validateProductDetails, Order.create);
// get all orders
ordersRoutes.get("/all", Order.getAll);
// get order by id
ordersRoutes.get("/:id", authenticateToken ,validateOrderId, Order.search);
// update the status of order
ordersRoutes.put("/:id", validateUpdateOrderStatus, Order.update);
// Delete order route
ordersRoutes.delete("/:id", validateOrderId, Order.deletedOrder);
module.exports = ordersRoutes;
