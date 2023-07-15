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

exports.get_tours = factory.getAll(Tour);
exports.get_tour = factory.getOne(Tour, { path: 'reviews' });
exports.create_tour = factory.createOne(Tour);
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

exports.get_tours_withinDistance = catchAsyncErr(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [ lat, lng ] = latlng.split(',');

  if (!lat || !lng) {
    return next(
      new AppError(
        'Please provide latitude and longitude in the format latitude,longitude',
        400
      )
    );
  }

  const radius = unit === 'mi'
                  ? distance / 3963.2
                  : distance / 6378.1

  const tours = await Tour.find({
    startLocation : {
      $geoWithin: {
        $centerSphere :
          [
            [lng, lat],
            radius
          ]
      }
    }
  });

  res.status(200).json({
    status:'success',
    results: tours.length,
    data:{
      tours
    }
  });

});

exports.get_tours_distances = catchAsyncErr( async (req, res, next) => {
  const { latlng } = req.params;
  const [ lat, lng ] = latlng.split(',');

  if (!lat || !lng) {
    return next(
      new AppError(
        'Please provide latitude and longitude in the format latitude,longitude',
        400
      )
    );
  }

  const distances = await Tour.aggregate([
    {
      $geoNear : {
        near: {
          type : 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: 0.001
      }
    },
    {
      $project:{
        distance: 1,
        name: 1,
      }
    }
  ]);

  res.status(200).json({
    status:'success',
    data:{
      distances
    }
  });
});