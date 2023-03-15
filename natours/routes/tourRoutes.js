const express = require('express');
const tourController = require('./../controllers/tourController');

const router = express.Router();

router.param('id', tourController.checkId)

router
  .route('/')
  .get(tourController.get_tours)
  .post(tourController.validate ,tourController.create_tour);

router
  .route('/:id') 
  .get(tourController.get_tour)
  .patch(tourController.update_tour)
  .delete(tourController.delete_tour);

module.exports = router;
