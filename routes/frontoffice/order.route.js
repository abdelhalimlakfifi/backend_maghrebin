const express = require("express");
const Order = require("../../controllers/frontoffice/order.controller");
const ordersRoutes = express.Router();

ordersRoutes.post("/order", Order.create);

module.exports = ordersRoutes;
