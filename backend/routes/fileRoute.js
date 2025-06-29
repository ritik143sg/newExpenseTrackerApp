const express = require("express");

const { authenticate } = require("../middleWare/authentication");
const { getExpenseFile } = require("../controllers/expenseController");

const fileRoute = express.Router();

fileRoute.get("/getfile", authenticate, getExpenseFile);

module.exports = { fileRoute };
