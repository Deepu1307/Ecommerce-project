const catchAsync = require("./../utils/catchAsync");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("./../utils/appError");

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const feature = new APIFeatures(Model.find(), req.query)
      .search()
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const docs = await feature.query;
    res.status(200).json({
      status: "success",
      results: docs.length,
      data: {
        docs,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    const query = Model.findById(req.params.id);
    if (popOptions) query.populate(popOptions);

    const doc = await query;
    console.log(doc);

    if (!doc) {
      return next(new AppError("No document fimd with that id", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    req.body.user = req.user._id;
    const doc = await Model.create(req.body);

    await doc.save();
    console.log(req.body);

    res.status(200).json({
      status: "success",
      data: {
        doc,
      },
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    console.log(req.body);
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    await doc.save();

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        doc,
      },
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });
