const dotenv = require("dotenv");
dotenv.config({ path: "./backend/config/config.env" });

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require("./app.js");
const databseConnect = require("./config/database");

// CONNECTION TO DATABASE
databseConnect();

// LISTENING APP ON `${PORT}`
const port = process.env.PORT || 8000;

const server = app.listen(port, () => {
  console.log(`Server is running on port  ${port} 🔥🔥`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
