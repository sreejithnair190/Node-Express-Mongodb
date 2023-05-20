const express = require('express');
const userController = require('./../controllers/userController')
const router = express.Router();
const authController = require('./../controllers/authController');

router.post('/sign-up', authController.sign_up)
router.post('/login', authController.login)

router
  .route('/')
  .get(userController.get_all_users)
  .post(userController.create_user);

router
  .route('/:id')
  .get(userController.get_user)
  .patch(userController.update_user)
  .delete(userController.delete_user);

module.exports = router