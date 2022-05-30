const express = require("express");
const reviewController = require("../controllers/reviewController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .patch(authController.protect, reviewController.createProductReview)
  .get(reviewController.getProductReviews)
  .delete(authController.protect, reviewController.deleteProductReview);

// router.use(authController.protect);
// router
//   .route("/")
//   .get(reviewController.getAllProductReview)
//   .post(authController.protect, reviewController.createProductReview);

// router
//   .route("/:id")
//   .get(reviewController.getProductReview)
//   .patch(authController.protect, reviewController.updateProductReview)
//   .delete(authController.protect, reviewController.deleteProductReview);

module.exports = router;
