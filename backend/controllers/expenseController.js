const { User } = require("../models");
const Expense = require("../models/expenseModel");
const sequelize = require("../utils/DB/DbConnect");
const AWS = require("aws-sdk");

function uploadToS3(data, fileName) {
  let s3bucket = new AWS.S3({
    accessKeyId: process.env.IAM_USER_KEY,
    secretAccessKey: process.env.IAM_USER_SECRET,
  });

  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: fileName,
    Body: data,
    ACL: "public-read",
  };

  return new Promise((resolve, reject) => {
    s3bucket.upload(params, (err, s3response) => {
      if (err) {
        console.log("Error uploading to S3", err);
        reject(err);
      } else {
        console.log("Upload Success", s3response);
        resolve(s3response.Location); // file URL
      }
    });
  });
}

const addExpense = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const data = req.body;

    const expense = await Expense.create(
      {
        amount: data.amount,
        description: data.description,
        category: data.category,
        UserId: req.user.id,
      },
      { transaction }
    );
    const cost = await User.findByPk(req.user.id);
    console.log(typeof data.amount);
    await User.update(
      { totalCost: cost.totalCost + Number(data.amount) },
      {
        where: {
          id: req.user.id,
        },
        transaction,
      }
    );
    (await transaction).commit();
    res.status(201).json({ msg: "expense Added", expense: expense });
  } catch (error) {
    (await transaction).rollback();
    res
      .status(500)
      .json({ msg: "expense Adding failed", error: error.message });
  }
};

const getAllExpense = async (req, res) => {
  const user = req.user;
  const pageId = req.params.id;
  const rowLimit = Number(req.query.limit);

  // console.log(typeof req.query.limit);

  try {
    const expenses = await Expense.findAll({
      where: {
        UserId: user.id,
      },
      limit: rowLimit,
      order: [["createdAt", "DESC"]],
      offset: (Number(pageId) - 1) * rowLimit,
    });

    const expenses1 = await Expense.findAll({
      where: {
        UserId: user.id,
      },
      limit: rowLimit,
      order: [["createdAt", "DESC"]],
      offset: Number(pageId) * rowLimit,
    });

    let pre = false;
    let curr = false;
    let next = false;

    if (pageId != 1) {
      pre = true;
    }
    if (expenses.length > 0) {
      curr = true;
    }

    if (expenses1.length > 0) {
      next = true;
    }

    res.status(201).json({
      msg: "expense is retrive",
      expense: expenses,
      page: { pre, curr, next, pageId },
    });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "expense getting failed", error: error.message });
  }
};

const getLeaderBoardExpense = async (req, res) => {
  const user = req.user;
  const pageId = req.params.id;

  try {
    const expenses = await Expense.findAll({
      where: {
        UserId: user.id,
      },
      order: [["createdAt", "DESC"]],
    });

    res.status(201).json({
      msg: "expenses retrived",
      expense: expenses,
    });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "expense getting failed", error: error.message });
  }
};

const delExpense = async (req, res) => {
  const data = req.user;
  const transaction = await sequelize.transaction();
  try {
    const id = req.params.id;
    const expense = await Expense.findByPk(id);

    if (expense) {
      await Expense.destroy({
        where: {
          id: id,
        },
        transaction,
      });
      const cost = await User.findByPk(req.user.id);
      await User.update(
        { totalCost: cost.totalCost - expense.amount },
        {
          where: {
            id: req.user.id,
          },
          transaction,
        }
      );
      (await transaction).commit();
      res.status(201).json({ msg: "expense deleted", expense: expense });
    } else res.status(404).json({ msg: "User Not Found" });
  } catch (error) {
    (await transaction).rollback();
    res
      .status(500)
      .json({ msg: "expense deletion failed", error: error.message });
  }
};

const getExpenseFile = async (req, res) => {
  const user = req.user;

  try {
    const expenses = await Expense.findAll({
      where: { UserId: user.id },
      order: [["createdAt", "DESC"]],
    });

    const stringExpense = JSON.stringify(expenses);
    const fileName = `expenses_${user.id}_${Date.now()}.txt`; // unique filename
    const fileUrl = await uploadToS3(stringExpense, fileName); // await here

    res.status(201).json({
      msg: "File retrieved",
      expense: expenses,
      fileUrl: fileUrl,
    });
  } catch (error) {
    console.error("getExpenseFile error:", error);
    res
      .status(500)
      .json({ msg: "Expense fetching failed", error: error.message });
  }
};

module.exports = {
  addExpense,
  getAllExpense,
  delExpense,
  getLeaderBoardExpense,
  getExpenseFile,
};
