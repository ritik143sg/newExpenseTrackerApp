const express = require("express");

const getAllPrimium = require("../controllers/premiumController");

const premiumRoute = express.Router();

premiumRoute.get("/", getAllPrimium);

module.exports = premiumRoute;
