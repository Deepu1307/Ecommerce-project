const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Product = require("../models/productModel");

// Create new review or Update existed review
exports.createProductReview = catchAsync(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);
  console.log(product);

  const hasReview = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (hasReview) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === review.user.toString())
        (rev.rating = review.rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratingsAverage = avg / product.reviews.length;
  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    data: product,
  });
});

// Get all reviews of product
exports.getProductReviews = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: product.reviews,
  });
});

// Delete review of product using productId and reviewId
exports.deleteProductReview = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  const hasReview = product.reviews.find(
    (rev) => rev._id === req.query.reviewId
  );

  if (!hasReview)
    return next(new AppError("This id doesn't belong to any review", 404));

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.reviewId.toString()
  );

  if (reviews.length === 0)
    return next(new AppError("Product has not any review to delete", 404));

  let avg = 0;
  reviews.forEach((rev) => (avg += rev.rating));

  const numberOfReviews = reviews.length;
  const ratingsAverage = avg / numberOfReviews;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews: reviews,
      numOfReviews: Number(numberOfReviews),
      ratingsAverage: Number(ratingsAverage),
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: "success",
    data: null,
  });
});

/*
const Review = require("../models/reviewModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAllReview = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();

  if (!reviews) {
    return next(new AppError("No document found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const review = await Review.create(req.body);
  res.status(200).json({
    status: "success",
    data: {
      data: review,
    },
  });
});

exports.getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError("No document found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      review,
    },
  });
});

exports.updateReview = catchAsync(async (req, res, next) => {
  const updatedReview = await Review.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  await updatedReview.save();

  if (!updatedReview) {
    return next(new AppError("No document found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      updatedReview,
    },
  });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  await Review.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    data: null,
  });
});


*/
