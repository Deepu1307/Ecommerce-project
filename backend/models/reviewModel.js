/*
const Product = require("./productModel");
const { Schema } = require("mongoose");
const mongoose = require("mongoose");

// CREATING SCHEMA
const reviewSchema = new Schema({
  review: {
    type: String,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
    required: [true, "A review must belong to a tour."],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "A review must belong to a user"],
  },
});

// Preventing from duplication of review on same tour from same user
// Combined index
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Creating calcAverageRating() static method for calculating average rating and number of ratings on product. It should work on creating, updating and deleting of review.
reviewSchema.statics.calcAverageRating = async function (productId) {
  // "this" represents here model
  const stats = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: "$product",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  console.log(stats, "rrrr");
  // console.log(Product, "product");

  // const doc = await Product.findByIdAndUpdate(
  //   productId,
  //   {
  //     ratingsAverage: stats[0],
  //     ratingsQuantity: stats[0],
  //   },
  //   {
  //     new: true,
  //     runValidators: true,
  //   }
  // );
};

// As you know static methods only call on Model so we have to think about how to call calcAverageRating() static method. problem is that we have to get this product id which one is used to creating review so we only get this id on document middleware("post") for creating and for updating and deleting we will get from get from query middleware(/^findOne/).

// Document middleware("save")
reviewSchema.post("save", function () {
  this.constructor.calcAverageRating(this.product);
});

reviewSchema.post(/^findOneAnd/, async function () {
  // console.log(await this.findOne());
  this.r = await this.clone().findOne();
  console.log(this.r, "query");
  console.log(Product, "testing");
});

reviewSchema.post(/^findOneAnd/, function () {
  this.r.constructor.calcAverageRating(this.r.product);
});

// reviewSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "product",
//     select: "name",
//   });
//   next();
// });

// CREATING MODEL
const Review = mongoose.model("Review", reviewSchema);
// We can call here static method but we will not get productId so we have to call this static method before creating of Model.
// Review.calcAverageRating();

// EXPORTING
module.exports = Review;

*/
