const Tour = require('./../models/tourModel');
const ApiFeatures = require('./../utils/apiFeatures');

exports.aliasTopTours = (req, res, next) => {
  try {
    req.query.limit = '5';
    req.query.sort = 'price,-ratingsAverage';
    req.query.fields = 'name,price,ratingsAverage,difficulty'
    next();
  } catch (error) {
    res.status(404).json({
      status:"error",
      message:error
    })
  }
}


exports.get_tours = async (req, res) => {

  try {

    const features = new ApiFeatures(Tour.find(), req.query);
    features
      .filter()
      .sort()
      .limit()
      .paginate();
    const tours = await features.query;

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    res.status(404).json({
      status:"error",
      message:error
    })
  }  
};

exports.get_tour = async (req, res) => {
  
  try {
    const id = req.params.id;
    const tour = await Tour.findById(id);
    res.status(200).json({
      status: 'success',
      requestedTime: req.requestedTime,
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status:"error",
      message:error
    })
  }
  
};

exports.create_tour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error,
    });
  }
};

exports.update_tour = async (req, res) => {
  try {
    const id = req.params.id;
    const tour = await Tour.findByIdAndUpdate(id, req.body, {
      new:true,
      runValidators:true
    });
    res.status(200).json({
      status: 'success',
      requestedTime: req.requestedTime,
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status:"error",
      message:error
    })
  }
};

exports.delete_tour = async (req, res) => {
  try {
    const id = req.params.id;
    const tour = await Tour.findByIdAndDelete(id);
    res.status(200).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(404).json({
      status: 'error',
      message:error
    });
  }
};
