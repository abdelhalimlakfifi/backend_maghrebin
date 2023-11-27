const express = require("express");
const Order = require("../../controllers/frontoffice/order.controller");
const {
  validateUpdateOrder,
  validateOrderId,
  validateProductDetails,
} = require("../../middleware/order.middleware");
const ordersRoutes = express.Router();
// create order
ordersRoutes.post("/order", validateProductDetails, Order.create);
// get all orders
ordersRoutes.get("/all", Order.getAll);
// get order by id
ordersRoutes.get("/:id", validateOrderId, Order.search);
// update the order
ordersRoutes.put("/:id", validateUpdateOrder, Order.update);
// Delete order route
ordersRoutes.delete("/:id", validateOrderId, Order.deletedOrder);
module.exports = ordersRoutes;
