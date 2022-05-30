const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");
const util = require("util");
const sendEmail = require("../utils/email");
const crypto = require("crypto");

const signToken = (id) => {
  //   jwt.sign(payload, secretOrPrivateKey, [options, callback]);
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const sendCookieAndToken = (res, statusCode, user) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() * process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    // secure: true,
  };

  // when we set secure = true, it only works in browser in https protocol.So for testing(developement) purpose we are not passing in developement environment.
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  // Remove passwod and active fields from output
  user.password = undefined;
  user.active = undefined;

  res.cookie("jwt", token, cookieOptions);
  //   res.cookie("jwt", token, cookieoptions)
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  // Creating User
  const user = await User.create(req.body);
  console.log(req.body);

  // Sign token
  sendCookieAndToken(res, 201, user);
});

exports.login = catchAsync(async (req, res, next) => {
  // Get email and password from req body
  const { email, password } = req.body;

  // Check email or password
  if (!email || !password) {
    return next(new AppError("Please provide email or password", 400));
  }

  // Find user data along with password using email
  const user = await User.findOne({ email: email }).select("+password");

  // If password is correct then find user
  if (!email || (await !user.comparePassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }
  // console.log(await user.comparePassword(password, user.password));
  // send data and token
  sendCookieAndToken(res, 200, user);
});

exports.protect = catchAsync(async (req, res, next) => {
  // Get token from req.headers.authorization or req.cookies
  let token = req.cookies.jwt;

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // Decode the token, extract id, iat and more
  //   jwt.verify(token, secretOrPublicKey, [options, callback]);
  const decoded = await util.promisify(jwt.verify)(
    req.cookies.jwt,
    process.env.JWT_SECRET
  );

  // Check, have password changed and timing of issued token is greater than passwordChangedAt timing

  // Find User
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exists.",
        401
      )
    );
  }

  // then send user data into req object
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError(`You are not allowed to perform this action`));
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1). Get user based on email.
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with this email", 404));
  }

  // 2). Geerate random reset token
  const resetToken = user.createResetToken();
  await user.save({ validateBeforeSave: false });

  // 3). Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password ? Submit a PATCH request with your new password and confirm your password to: ${resetURL}.\n If you didnot forget your password. Please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Please reset your password within 10 minutes.",
      message,
    });

    res.status(200).json({
      status: "success",
      message: `Token sent to email successfully.`,
    });
  } catch (err) {
    user.passwordResettoken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    next(
      new AppError(
        "There was an error sending email, Please try agian later.",
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // Create hash from token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResettoken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // if match then allow him to set password

  if (!user) {
    return next(
      new AppError("Reset Token is invalid or has been expired", 400)
    );
  }

  if (req.body.password !== req.body.passwordConfirm) {
    return next(new AppError("Password and Confirm password is not same", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save({ validateBeforeSave: false });

  sendCookieAndToken(res, 200, user);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");

  if (!(await user.comparePassword(req.body.currentPassword, user.password))) {
    return next(new AppError("Your current password is wrong", 401));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save();

  console.log(user);
  res.status(200).json({
    status: "sucess",
    data: {
      user,
    },
  });
});

exports.logout = catchAsync(async (req, res, next) => {
  const cookieOptions = {
    expires: new Date(Date.now()),
    httpOnly: true,
    // secure: true,
  };
  res.cookie("jwt", null, cookieOptions);
  res.status(200).json({
    status: "success",
    message: "logged out successfully!",
  });
});
