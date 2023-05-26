const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');

const router = express.Router();

const restrictUserMiddleware = authController.restrict_user_to(
  'admin',
  'lead-user'
);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.get_tours);

router.route('/tour-stats').get(tourController.get_tour_stats);

router.route('/monthly-plan/:year').get(tourController.get_monthly_plan);

router
  .route('/')
  .all(authController.protect)
  .get(tourController.get_tours)
  .post(tourController.create_tour);

router
  .route('/:id')
  .all(authController.protect)
  .get(tourController.get_tour)
  .patch(restrictUserMiddleware, tourController.update_tour)
  .delete(restrictUserMiddleware, tourController.delete_tour);

module.exports = router;
