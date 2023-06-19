const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./../routes/reviewRoutes');

const router = express.Router();

const protect = authController.protect;
const allowOnlyAdminAndLeadGuide = authController.restrict_user_to(
  'admin',
  'lead-user'
);
const allowOnlyAdminAndGuides = authController.restrict_user_to(
  'admin',
  'lead-user',
  'guide'
);

router.use('/:tour_id/reviews', reviewRouter);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.get_tours);

router.route('/tour-stats').get(tourController.get_tour_stats);

router.route('/monthly-plan/:year').get(protect, allowOnlyAdminAndGuides, tourController.get_monthly_plan);

router
  .route('/')
  .get(tourController.get_tours)
  .post(protect, allowOnlyAdminAndLeadGuide, tourController.create_tour);

router
  .route('/:id')
  .get(tourController.get_tour)
  .patch(protect, allowOnlyAdminAndLeadGuide, tourController.update_tour)
  .delete(protect, allowOnlyAdminAndLeadGuide, tourController.delete_tour);

module.exports = router;
