const express = require("express");
const {
  getSesssionId,
  paymentStatus,
} = require("../controllers/paymentController");
const { authenticate } = require("../middleWare/authentication");

const paymentRoute = express.Router();

paymentRoute.get("/sessionId", authenticate, getSesssionId);
paymentRoute.get("/status/:id", paymentStatus);

module.exports = { paymentRoute };
