const express = require("express");
const {
  addUser,
  logUser,
  setPassword,
} = require("../controllers/userController");
const { authenticate } = require("../middleWare/authentication");

const userRoute = express.Router();

userRoute.post("/signup/add", addUser);
userRoute.post("/login", logUser);
userRoute.post("/changePassword", setPassword);

module.exports = userRoute;
