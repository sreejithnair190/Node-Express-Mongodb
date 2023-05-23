const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const slugify = require('slugify');
const validator = require('validator');

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
  passwordChangedAt: Date
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

const User = mongoose.model('User', userSchema);

module.exports = User;
