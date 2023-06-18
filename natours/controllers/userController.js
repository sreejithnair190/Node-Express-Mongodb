const User = require('./../models/userModel');
const catchAsyncErr = require('./../utils/catchAsyncErr');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');


const filterObj = (obj, ...allowedFields) => {
  const newObj = {}
  Object.keys(obj).map( el => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  })
  return newObj;
}

exports.get_account = (req, res, next) => {
  req.params.id = req.user.id;
  next();
}

exports.update_account = catchAsyncErr(async (req, res, next) => {
  if (req.body.password || req.body.confirm_password) {
    return next(new AppError('You cannot update password here', 400));
  }

  const filteredObj = filterObj(req.body, 'name', 'email');
  const user = await User.findByIdAndUpdate(req.user.id, filteredObj, { new:true, runValidators:true }) 
  
  res.status(200).json({
    status:'success',
    data:{
      user
    }
  })

});

exports.deactivate_account = catchAsyncErr( async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active:false });

  res.status(200).json({
    status:'success',
    data:{
      message:"Your account has been deactivated."
    }
  })
});

exports.get_users = factory.getAll(User);
exports.get_user = factory.getOne(User);
exports.update_user = factory.updateOne(User);
exports.delete_user = factory.deleteOne(User);