const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsyncErr');

exports.get_overview = catchAsync(async (req, res) => {
  const tours = await Tour.find();

  res.status(200).render('overview', {
    title:'All Tours',
    tours
  })
});

exports.get_tour = (req, res) => {
  res.status(200).render('tour', {
    title:'The Forest Hiker'
  })
}