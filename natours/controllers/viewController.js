const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsyncErr');

exports.get_overview = catchAsync(async (req, res) => {
  const tours = await Tour.find();

  res.status(200).render('overview', {
    title:'All Tours',
    tours
  })
});

exports.get_tour = catchAsync(async (req, res) => {

  const tour = await Tour.findOne({slug: req.params.slug}).populate({
    path:'reviews',
    fields: 'review rating user'
  });

  res.status(200).render('tour', {
    title:tour.name,
    tour
  })
});