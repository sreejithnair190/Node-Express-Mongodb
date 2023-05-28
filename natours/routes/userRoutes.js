const express = require('express');
const userController = require('./../controllers/userController');
const router = express.Router();
const authController = require('./../controllers/authController');

const protect = authController.protect;

router.post('/sign-up', authController.sign_up);
router.post('/login', authController.login);

router.post('/forgot-password', authController.forgot_password);
router.patch('/reset-password/:token', authController.reset_password);
router.patch(
  '/update-password',
  protect,
  authController.update_password
);
router.patch(
  '/update-account',
  protect,
  userController.update_account
);
router.delete(
  '/deactivate-account',
  protect,
  userController.deactivate_account
)

router
  .all(protect)
  .route('/')
  .get(userController.get_users)
//   .get(userController.get_all_users)
//   .post(userController.create_user);

// router
//   .route('/:id')
//   .get(userController.get_user)
//   .patch(userController.update_user)
//   .delete(userController.delete_user);

module.exports = router;
