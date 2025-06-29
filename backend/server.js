const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
//const helmet = require("helmet");
//const compression = require("compression");
//const morgan = require("morgan");
const dotenv = require("dotenv");

const sequelize = require("./utils/DB/DbConnect");
const userRoute = require("./routes/userRoute");
const expenseRoute = require("./routes/expenseRoute");
const { paymentRoute } = require("./routes/paymentRoute");
const { orderRoute } = require("./routes/orderRoute");
const premiumRoute = require("./routes/premiumFeature");
const passwordRoute = require("./routes/passwordRoute");
const { fileRoute } = require("./routes/fileRoute");

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Load models (relations are set up inside)
require("./models");

// Ensure logs directory exists
// const logsDir = path.join(__dirname, "logs");
// if (!fs.existsSync(logsDir)) {
//   fs.mkdirSync(logsDir);
// }

// Setup request logging using Morgan
// const accessLogStream = fs.createWriteStream(path.join(logsDir, "access.log"), {
//   flags: "a",
// });

// Middlewares
app.use(express.static(path.join(__dirname, "..", "frontend")));
app.use(express.json());
app.use(cors());
// app.use(helmet());
// app.use(compression());
// app.use(morgan("combined", { stream: accessLogStream }));
// if (process.env.NODE_ENV !== "production") {
//   app.use(morgan("dev")); // console logging in development
// }

// Routes
app.use("/user", userRoute);
app.use("/expense", expenseRoute);
app.use("/payment", paymentRoute);
app.use("/order", orderRoute);
app.use("/premiumFeature", premiumRoute);
app.use("/password", passwordRoute);
app.use("/file", fileRoute);

// Global error handler (Optional - if using winston for errors)
// app.use((err, req, res, next) => {
//   logger.error({
//     message: err.message,
//     stack: err.stack,
//     url: req.originalUrl,
//     method: req.method,
//   });
//   res.status(500).json({ error: "Something went wrong" });
// });

// Start server
const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  const htmlFile = path.join(__dirname, "..", "frontend", "login.html");
  res.sendFile(htmlFile);
});

sequelize
  .sync({ force: false })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error({ message: err.message, stack: err.stack });
    console.error("❌ Sequelize sync failed:", err);
  });
