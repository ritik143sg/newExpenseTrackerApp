const express = require("express");

const { authenticate } = require("../middleWare/authentication");
const getOrder = require("../controllers/orderController");

const orderRoute = express.Router();

orderRoute.get("/", authenticate, getOrder);

module.exports = { orderRoute };
