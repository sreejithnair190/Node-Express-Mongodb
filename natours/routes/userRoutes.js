const express = require('express');
const userController = require('./../controllers/userController');
const router = express.Router();
const authController = require('./../controllers/authController');

router.post('/sign-up', authController.sign_up);
router.post('/login', authController.login);

router.post('/forgot-password', authController.forgot_password);
router.patch('/reset-password/:token', authController.reset_password);

// Restricted to only authenticated user
router.use(authController.protect);

router.patch('/update-password', authController.update_password);
router.patch('/update-account', userController.update_account);
router.delete('/deactivate-account', userController.deactivate_account);

router.get('/my-account', userController.get_account, userController.get_user);

// Restricted to only admin
router.use(authController.restrict_user_to('admin'));

router.route('/').get(userController.get_users);

router
  .route('/:id')
  .get(userController.get_user)
  .patch(userController.update_user)
  .delete(userController.delete_user);

module.exports = router;
