const OrderController = require("../controllers/orderController");
const AuthController = require("../controllers/authController");
const express = require("express");

const router = express.Router();

router.use(AuthController.protect);

// Routes for USERS
router.post("/new", OrderController.createOrder);
router.get("/me", OrderController.getMyOrders);

router.route("/:id").get(OrderController.getOrderById);

// Routes for ADMIN
router.use(AuthController.restrictTo("admin"));
router.get("/admin/orders", OrderController.getAllOrders);
router
  .route("/admin/orders/:id")
  .patch(OrderController.updateOrder)
  .delete(OrderController.deleteOrder);

module.exports = router;

/*

const express = require("express");
const {
  newOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");
const router = express.Router();

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.route("/order/new").post(isAuthenticatedUser, newOrder);

router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);

router.route("/orders/me").get(isAuthenticatedUser, myOrders);

router
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);

router
  .route("/admin/order/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);

module.exports = router;



*/
