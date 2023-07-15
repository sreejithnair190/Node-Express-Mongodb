const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'A review cannot be empty'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'A review must belong to tour'],
      },
    ],
    user: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A review must belong to user'],
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.index({tour:1, user:1}, {unique:true })

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'tour',
    select: 'name',
  }).populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

reviewSchema.statics.calculateAverageRatings = async function (tour_id) {
  const stats = await this.aggregate([
    {
      $match: { tour: tour_id },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  if(stats.length > 0){
    await Tour.findByIdAndUpdate(tour_id, {
      ratingsAverage: stats[0].avgRating,
      ratingsQuantity: stats[0].nRating,
    });
  }else{
    await Tour.findByIdAndUpdate(tour_id, {
      ratingsAverage: 0,
      ratingsQuantity: 4.5
    });
  }

};

reviewSchema.post('save', function(){
  this.constructor.calculateAverageRatings(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function(next){
  this.review = await this.clone().findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function(){
  await this.review.constructor.calculateAverageRatings(this.review.tour)
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
