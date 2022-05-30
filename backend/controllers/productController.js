const catchAsync = require("./../utils/catchAsync");
const Product = require("./../models/productModel");
const factory = require("./handleFactory");
const APIFeatures = require("./../utils/apiFeatures");

exports.getAllProduct = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Product.find(), req.query)
    .search()
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const products = await features.query;
  res.status(200).json({
    status: "success",
    results: products.length,
    products,
  });
});

exports.getProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
};

exports.createProduct = async (req, res, next) => {
  req.body.user = req.user._id;
  const newProduct = await Product.create(req.body);

  res.status(200).json({
    status: "success",
    data: {
      newProduct,
    },
  });
};

exports.updateProduct = async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
};

exports.deleteProduct = async (req, res, next) => {
  await Product.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: "success",
    data: null,
  });
};

/*
// Create New Review or Update the review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// Get All Reviews of a product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Delete Review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});

*/

// exports.getAllProduct = factory.getAll(Product);
// exports.getProduct = factory.getOne(Product, "reviews");
// exports.createProduct = factory.createOne(Product);
// exports.updateProduct = factory.updateOne(Product);
// exports.deleteProduct = factory.deleteOne(Product);

// exports.getAllProduct = factory.getAll(Product);
// exports.getProduct = factory.getOne(Product, "reviews");
// exports.createProduct = factory.createOne(Product);
// exports.updateProduct = factory.updateOne(Product);
// exports.deleteProduct = factory.deleteOne(Product);
