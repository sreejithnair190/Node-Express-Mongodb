const express = require('express');
const authController = require('./../controllers/authController');
const reviewController = require('./../controllers/reviewController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(reviewController.get_reviews)
  .post(
    authController.restrict_user_to('user'),
    reviewController.setTourAndUserIds,
    reviewController.create_review
  );

router
  .route('/:id')
  .get(authController.protect, reviewController.get_review)
  .patch(
    authController.protect,
    authController.restrict_user_to('user', 'admin'),
    reviewController.update_review
  )
  .delete(
    authController.protect,
    authController.restrict_user_to('user', 'admin'),
    reviewController.delete_review
  );

module.exports = router;
