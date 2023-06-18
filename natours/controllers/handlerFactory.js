const AppError = require('./../utils/appError');
const catchAsyncErr = require('./../utils/catchAsyncErr');
const ApiFeatures = require('./../utils/apiFeatures');

exports.deleteOne = (Model) =>
  catchAsyncErr(async (req, res, next) => {
    const id = req.params.id;
    const doc = await Model.findByIdAndDelete(id);

    if (!doc) {
      return next(new AppError('No Document Found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsyncErr(async (req, res, next) => {
    const id = req.params.id;
    const doc = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('No Document Found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });

exports.createOne = (Model) =>
  catchAsyncErr(async (req, res, next) => {
    const newDoc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: newDoc,
      },
    });
  });

exports.getOne = (Model, populateOptions) =>
  catchAsyncErr(async (req, res, next) => {
    const id = req.params.id;
    let query = Model.findById(id);
    if (populateOptions) query = query.populate(populateOptions);

    const doc = await query;

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsyncErr(async (req, res, next) => {

    let filter = {};
    if (req.params.tour_id) filter = { tour: req.params.tour_id}

    const features = new ApiFeatures(Model.find(filter), req.query);
    features.filter().sort().limit().paginate();
    const docs = await features.query;

    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: {
        data: docs
      },
    });
  });