const { fn, col } = require("sequelize");
const { Expense, User } = require("../models");

const getAllPrimium = async (req, res) => {
  try {
    const expensePremium = await User.findAll({
      attributes: ["id", "username", "totalCost"],
      order: [["totalCost", "DESC"]],
    });

    res.json({ all: "expensePremium", data: expensePremium });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = getAllPrimium;
