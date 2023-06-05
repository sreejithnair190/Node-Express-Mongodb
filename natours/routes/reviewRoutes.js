const express = require('express');
const authController = require('./../controllers/authController');
const reviewController = require('./../controllers/reviewController');

const router = express.Router({ mergeParams:true });

router
  .route('/')
  .all(authController.protect)
  .get(reviewController.get_reviews)
  .post(
    authController.restrict_user_to('user'),
    reviewController.create_review
  );

module.exports = router;
