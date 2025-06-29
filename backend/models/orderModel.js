const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../utils/DB/DbConnect");

const Order = sequelize.define("Order", {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  OrderId: { allowNull: false, type: DataTypes.STRING },
  OrderStatus: { allowNull: false, type: DataTypes.STRING },
});

module.exports = Order;
