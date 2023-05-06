const express = require('express');
const tourController = require('./../controllers/tourController');

const router = express.Router();

// router.param('id', tourController.checkId)

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.get_tours)

router
  .route('/tour-stats')
  .get(tourController.get_tour_stats)

router
  .route('/monthly-plan/:year')
  .get(tourController.get_monthly_plan)

router
  .route('/')
  .get(tourController.get_tours)
  .post(tourController.create_tour);

router
  .route('/:id') 
  .get(tourController.get_tour)
  .patch(tourController.update_tour)
  .delete(tourController.delete_tour);

module.exports = router;
