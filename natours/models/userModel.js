const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const slugify = require('slugify');
const validator = require('validator');
const crypto = require('crypto');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
  },
  email: {
    type: String,
    required: [true, 'A user must have a email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    // default: 'user'
  },
  password: {
    type: String,
    required: [true, 'A user must have a password'],
    minlength: 8,
    select: false,
  },
  confirm_password: {
    type: String,
    required: [true, 'Please enter your password to confirm'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not same',
    },
  },
  passwordChangedAt: Date,
  resetPasswordToken: String,
  resetPassordTokenExpiry: Date,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = await bcrypt.hash(this.password, 12);
    this.confirm_password = undefined;
    return next();
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.comparePassword = async function (
  inputPassword,
  userPasswordFromDB
) {
  return await bcrypt.compare(inputPassword, userPasswordFromDB);
};

userSchema.methods.changedPasswordAfter = async function (jwt_timestamp) {
  const passwordChangedAt = parseInt(this.passwordChangedAt / 1000, 10);
  const isChanged = this.passwordChangedAt
    ? jwt_timestamp < passwordChangedAt
    : false;

  return isChanged;
};

userSchema.methods.resetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.resetPasswordTokenExpiry = Date.now() * 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
