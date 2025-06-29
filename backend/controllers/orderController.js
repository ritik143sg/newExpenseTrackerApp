const { Order } = require("../models");

const getOrder = async (req, res) => {
  const user = req.user;
  try {
    const order = await Order.findOne({
      where: {
        UserId: user.id,
      },
    });

    res.json({ order: order });
  } catch (error) {
    res.json({ error: error });
  }
};

module.exports = getOrder;
