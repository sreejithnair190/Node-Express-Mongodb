const express = require('express');
const viewController = require('./../controllers/viewController');

const router = express.Router();

router.get('/', viewController.get_overview);
router.get('/tour', viewController.get_tour);

module.exports = router;