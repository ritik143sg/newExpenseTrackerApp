const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../utils/DB/DbConnect");

const ForgotPasswordRequest = sequelize.define("ForgotPasswordRequest", {
  id: {
    primaryKey: true,
    allowNull: false,
    type: DataTypes.STRING,
  },
  isActive: {
    defaultValue: false,
    allowNull: false,
    type: DataTypes.BOOLEAN,
  },
});

module.exports = ForgotPasswordRequest;
