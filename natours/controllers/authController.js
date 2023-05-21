const jwt = require('./../utils/jwt');
const User = require('./../models/userModel');
const catchAsyncErr = require('./../utils/catchAsyncErr');
const AppError = require('./../utils/appError');

exports.login = catchAsyncErr(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Email and Password are required', 400));
    }

    const user = await User.findOne({email}).select('+password')

    if (!user || !(await user.comparePassword(password, user.password))) {
        return next(new AppError('Invalid credentials', 401));
    }

    const token = jwt.generateAuthToken({ id: user._id});
    
    res.status(200).json({
        status: 'success',
        token
    })
});

exports.sign_up = catchAsyncErr( async (req, res, next) => {
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirm_password: req.body.confirm_password
    });

    const payload = { id: user._id }
    const token = jwt.generateAuthToken(payload);

    res.status(201).json({
        status:'success',
        token,
        data:{
            user
        }
    })
});


exports.protect = catchAsyncErr(async (req, res, next) => {
   
    // Check whether the token is present
    const auth = req.headers.authorization;
    let token;
    
    if (auth && auth.startsWith('Bearer')) {
        token = auth.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('You are not logged in', 401))
    }

    // Verify token
    const decoded = jwt.decode(token);

    // Verify if user exist
    const user = await User.findById(decoded.id);
    if(!user){
        return next(new AppError('Account doesn\'t exist'), 401)
    }

    // Verify if password changed after login
    if (user.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('Something went wrong. Please login again', 401))
    }


    next();
});