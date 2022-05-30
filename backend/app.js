const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

// ROUTERS
const globalErrorHander = require("./controllers/errorController");
const ProductRouter = require("./routes/productRoutes");
const UserRouter = require("./routes/userRoutes.js");
const ReviewRouter = require("./routes/reviewRoutes");
const OrderRouter = require("./routes/orderRoutes");

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// Routes
app.use("/api/v1/products", ProductRouter);
app.use("/api/v1/users", UserRouter);
app.use("/api/v1/reviews", ReviewRouter);
app.use("/api/v1/orders", OrderRouter);

// Global error handling middleware
app.use(globalErrorHander);

module.exports = app;
