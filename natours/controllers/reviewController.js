const Review = require('./../models/reviewmodel');
const User = require('./../models/userModel');
const Tour = require('./../models/tourModel');
const catchAsynErr = require('./../utils/catchAsyncErr');
const AppError = require('./../utils/appError');


exports.get_reviews = catchAsynErr(async(req, res, next) => {
    let filter = {};
    if (req.params.tour_id) filter = { tour: req.params.tour_id}
    
    const reviews = await Review.find(filter);

    res.status(200).json({
        status:"success",
        data:{
            reviews
        }
    })
});

exports.create_review = catchAsynErr(async(req, res, next) => {

    if(!req.body.tour) req.body.tour = req.params.tour_id
    if(!req.body.user) req.body.user = req.user.id;

    const newReview = await Review.create(req.body);

    res.status(201).json({
        status:"success",
        message:"A review posted successfully",
        data:{
            review: newReview
        }
    });

});