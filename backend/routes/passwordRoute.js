const express = require("express");
const {
  getPassword,
  setPassword,
} = require("../controllers/passwordController");

const passwordRoute = express.Router();

passwordRoute.post("/forgetPassword", getPassword);
passwordRoute.get("/resetpassword/:id", setPassword);

module.exports = passwordRoute;
