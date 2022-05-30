const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const AppError = require("../utils/appError");

// CREATING SCHEMA
const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please tell your name"],
  },
  email: {
    type: String,
    required: [true, "Please tell your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  avatar: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: [8, "Password should have minimum 8 characters."],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (val) {
        return this.password === val;
      },
      message: "Password are not the same!",
    },
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "seller", "admin"],
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  passwordChangedAt: Date,
});

userSchema.pre("save", async function (next) {
  // If password is not modified then it will work
  if (!this.isModified("password")) return next();

  // Auto-gen a salt and hash of inputted password.
  this.password = await bcrypt.hash(this.password, 12);

  // Deleting this from database, beacuse we donot need to save password confirmation in database
  this.passwordConfirm = undefined;
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.comparePassword = async function (
  inputPassword,
  userHashPassword
) {
  return await bcrypt.compare(inputPassword, userHashPassword);
};

userSchema.methods.createResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  console.log({ resetToken }, this.passwordResetExpires);
  return resetToken;
};

// userSchema.methods.passwordChangedAfter = function (JWTTimestamp) {
//   const passwordChangeTime = Number.parseInt(this.passwordChangedAt, 10);
//   return passwordChangeTime > JWTTimestamp;
// };

// CREATING MODEL
const User = mongoose.model("User", userSchema);

// EXPORTING
module.exports = User;
