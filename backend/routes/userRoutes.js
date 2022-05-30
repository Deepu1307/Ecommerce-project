const express = require("express");
const AuthController = require("./../controllers/authController");
const UserController = require("./../controllers/userController");

const router = express.Router();

// AuthController
router.post("/signup", AuthController.signup);
router.post("/login", AuthController.login);
router.post("/forgotPassword", AuthController.forgotPassword);
router.patch("/resetPassword/:token", AuthController.resetPassword);
router.delete(
  "/:id",
  AuthController.protect,
  AuthController.restrictTo("admin"),
  UserController.deleteUser
);

router.get("/logout", AuthController.logout);

router.patch(
  "/updatePassword",
  AuthController.protect,
  AuthController.updatePassword
);

// UserController
router
  .route("/")
  .get(
    AuthController.protect,
    AuthController.restrictTo("admin"),
    UserController.getAllUser
  );
router.route("/:id").get(UserController.getUser);

router.patch("/updateMe", AuthController.protect, UserController.updateMe);
module.exports = router;
