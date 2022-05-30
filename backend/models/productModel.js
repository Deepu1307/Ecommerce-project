const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const Review = require("./reviewModel");

// CREATING SCHEMA
const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter product name"],
      unique: true,
      trim: true,
    },
    slug: String,
    price: {
      type: Number,
      required: [true, "A product must have a price"],
      maxlength: [8, "Price cannot exceeds 8 characters"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this only points to current doc on NEW document creation
          return val < this.price;
        },
        message: "Discount price ({VALUE}) should be below regular price",
      },
    },
    stock: {
      type: Number,
      required: [true, "Please Enter product Stock"],
      maxLength: [4, "Stock cannot exceed 4 characters"],
      default: 1,
    },
    summary: {
      type: String,
      required: [true, "A product must have a summary"],
    },
    description: {
      type: String,
      required: [true, "A product have a description"],
    },
    images: [
      {
        public_id: {
          type: String,
          required: [true, "Images public id is required"],
        },
        url: {
          type: String,
          required: [true, "Images url is required"],
        },
      },
    ],
    ratingsAverage: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
      },
    ],
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: [true, "A product must belong to a category"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    // ratingsAverage: {
    //   type: Number,
    //   default: 4.5,
    //   min: [1, "Rating must be above 1.0"],
    //   max: [5, "Rating must be below 5.0"],
    //   // Declaring custom function for do some opeartion from get value
    //   // set: (val) => Math.round(val * 10) / 10, // 4.666666, 46.6666, 47, 4.7
    //   set: (val) => Math.round(val * 10) / 10,
    // },
    // ratingsQuantity: {
    //   type: Number,
    //   default: 0,
    // },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.index({ name: "text", description: "text" });

// VIRTUAL POPULATE
// productSchema.virtual("reviews", {
//   ref: "Review",
//   foreignField: "product",
//   localField: "_id",
// });

// CREATING MODEL
const Product = mongoose.model("Product", productSchema);

// EXPORTING
module.exports = Product;
