const {
  createOrder,
  getPaymentStatus,
} = require("../services/cashFreeService");
const { User, Order } = require("../models");
const sequelize = require("../utils/DB/DbConnect");

const getSesssionId = async (req, res) => {
  const user = req.user;
  const transaction = await sequelize.transaction();
  try {
    const del = await Order.destroy({
      where: {
        UserId: user.id,
      },
      transaction,
    });

    const orderID = "ORDER_" + Date.now();
    const id = await createOrder(
      orderID,
      199,
      "INR",
      user.id,
      "9988776633",
      user.eamil
    );

    const order = await Order.create(
      {
        OrderId: orderID,
        OrderStatus: "Pending",
        UserId: user.id,
      },
      { transaction }
    );

    transaction.commit();
    res.json({ id: id });
  } catch (error) {
    transaction.rollback();
    res.status(500).json({ error: error });
  }
};

const paymentStatus = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const transaction = await sequelize.transaction();

  try {
    const response = await getPaymentStatus(id);
    console.log(response);
    //const transaction = sequelize.transaction();
    await Order.update({ OrderStatus: response }, { where: { OrderId: id } });

    const updatedOrder = await Order.findOne({ where: { OrderId: id } });
    // (await transaction).commit();
    res.json({ order: updatedOrder });
  } catch (err) {
    //transaction.rollback();
    console.error("Fetch payment error:", err);
  }
};

module.exports = { getSesssionId, paymentStatus };
