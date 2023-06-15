const Tour = require('./../models/tourModel');
const ApiFeatures = require('./../utils/apiFeatures');
const AppError = require('./../utils/appError');
const catchAsyncErr = require('./../utils/catchAsyncErr');
const factory = require('./handlerFactory');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'price,-ratingsAverage';
  req.query.fields = 'name,price,ratingsAverage,difficulty';
  next();
};

exports.get_tours = catchAsyncErr(async (req, res, next) => {
  const features = new ApiFeatures(Tour.find(), req.query);
  features.filter().sort().limit().paginate();
  const tours = await features.query;

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

exports.get_tour = catchAsyncErr(async (req, res, next) => {
  const id = req.params.id;
  const tour = await Tour.findById(id).populate('reviews')


  if (!tour) {
    return next(new AppError('Tour Not Found', 404));
  }

  res.status(200).json({
    status: 'success',
    requestedTime: req.requestedTime,
    data: {
      tour,
    },
  });
});

exports.create_tour = catchAsyncErr(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});


exports.update_tour = factory.updateOne(Tour);

exports.delete_tour = factory.deleteOne(Tour);

exports.get_tour_stats = catchAsyncErr(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: {
        ratingsAverage: { $gte: 4.5 },
      },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
        avgPrice: { $avg: '$price' },
      },
    },
    {
      $sort: {
        avgPrice: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    requestedTime: req.requestedTime,
    data: { stats },
  });
});

exports.get_monthly_plan = catchAsyncErr(async (req, res, next) => {
  const year = req.params.year * 1;
  const plans = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTours: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        month: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    results: plans.length,
    requestedTime: req.requestedTime,
    data: { plans },
  });
});
