const crypto = require('crypto');
const jwt = require('./../utils/jwt');
const User = require('./../models/userModel');
const catchAsyncErr = require('./../utils/catchAsyncErr');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');

exports.login = catchAsyncErr(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Email and Password are required', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppError('Invalid credentials', 401));
  }

  const token = jwt.generateAuthToken({ id: user._id });

  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.sign_up = catchAsyncErr(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    photo: req.body.photo,
    password: req.body.password,
    confirm_password: req.body.confirm_password,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  });

  const payload = { id: user._id };
  const token = jwt.generateAuthToken(payload);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
});

exports.protect = catchAsyncErr(async (req, res, next) => {
  // Check whether the token is present
  const auth = req.headers.authorization;
  let token;

  if (auth && auth.startsWith('Bearer')) {
    token = auth.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in', 401));
  }

  // Verify token
  const decoded = await jwt.decode(token);

  // Verify if user exist
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new AppError("Account doesn't exist"), 401);
  }

  // Verify if password changed after login
  if (await user.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('Password Changed. Please login again', 401));
  }

  req.user = user;

  next();
});

exports.restrict_user_to = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You don't have permisson to perform this action", 403)
      );
    }

    next();
  };
};

exports.forgot_password = catchAsyncErr(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('No user found with this email', 404));
  }

  const resetPasswordToken = user.createResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/reset-password/${resetPasswordToken}`;

  const message = `Forgot your password? Click here to reset your password: ${resetUrl} \nIf you didn't forgot your password, please ignore this message.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Reset your password (Valid for 10min)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Mail has been sent',
      url: resetUrl,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiry = undefined;
    user.save({ validateBeforeSave: false });

    return next(new AppError(error, 500));
  }
});

exports.reset_password = catchAsyncErr(async (req, res, next) => {
  const hashPassword = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashPassword,
    resetPasswordTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token is invalid or expired', 400));
  }

  user.password = req.body.password;
  user.confirm_password = req.body.confirm_password;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpiry = undefined;
  await user.save();

  const token = jwt.generateAuthToken({ id: user._id });

  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.update_password = catchAsyncErr(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  const current_password = req.body.current_password;
  if (!current_password) {
    return next(new AppError('Please enter current passwor', 400));
  }

  if (!(await user.comparePassword(current_password, user.password))) {
    return next(new AppError('Your current password is invalid', 401));
  }

  user.password = req.body.password;
  user.confirm_password = req.body.confirm_password;
  await user.save();

  const token = jwt.generateAuthToken({ id: user._id });
  res.status(200).json({
    status: 'success',
    token,
  });
});
