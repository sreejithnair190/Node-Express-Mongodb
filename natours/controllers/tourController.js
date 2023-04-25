const Tour = require('./../models/tourModel');

exports.get_tours = async (req, res) => {

  try {

    console.log(req.query);

    // Filtering 
    const queryObj = {...req.query};
    const excludedFields = ['limit', 'sort', 'page', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    //Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    const newQueryObj = JSON.parse(queryStr);

    let query = Tour.find(newQueryObj);

    // Sorting 
    let sort = req.query.sort;
    if (sort) {
      sort = sort.split(',').join(' ');
      query = query.sort(sort);
    }else{
      query = query.sort('-createdAt')
    }
    

    // Execute Query
    const tours = await query;

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
