const User = require('./../models/userModel');
const catchAsyncErr = require('./../utils/catchAsyncErr');
const AppError = require('./../utils/appError');
const { options } = require('../routes/userRoutes');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {}
  Object.keys(obj).map( el => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  })
  return newObj;
}


exports.get_users = catchAsyncErr(async (req, res, next) => {
  const users = await User.find();
  
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
})

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
