const express = require("express");
const ordersRoutes = express.Router();

ordersRoutes.post("/order", Add_Order_Controller);

module.exports = ordersRoutes;
