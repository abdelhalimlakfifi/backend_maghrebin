const express = require("express");
const { createOrder } = require("../../controllers/frontoffice/order.controller");
const ordersRoutes = express.Router();

ordersRoutes.post("/order", createOrder);

module.exports = ordersRoutes;
