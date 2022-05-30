const mongoose = require("mongoose");

const db = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

const databseConnect = async () => {
  await mongoose.connect(db);
  console.log("Successfully connected to database 🎆🎆");
};

module.exports = databseConnect;
