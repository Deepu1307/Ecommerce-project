const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const User = require("./../models/userModel");
const factory = require("./handleFactory");

exports.getAllUser = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.deleteUser = factory.deleteOne(User);

const filteredObj = function (reqBodyObj, ...allowedFields) {
  const newObj = {};
  Object.keys(reqBodyObj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = reqBodyObj[el];
    }
  });
  return newObj;
};

// This is only for user who is logged in right now.
// Updating the current user
exports.updateMe = catchAsync(async (req, res, next) => {
  // Create an error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword routes",
        400
      )
    );
  }

  // Update user
  // First way
  // const user = await User.findById(req.user._id);
  // const user = await User.findOne({ name: req.user.name });

  // user.name = "shubham";
  // await user.save(); // By this way we cannot update the user data. because in user model there is lots of required fields so we use here findByIdAndUpdate method and give him a fltered object whatever we want to update by this routes.

  // Second way
  // 2) Filtered out unwanted fields name that are not allowed to be updated
  const filteredBody = filteredObj(req.body, "name", "email");

  // 3) Update the user data
  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});
