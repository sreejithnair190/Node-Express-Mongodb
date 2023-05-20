const fs = require('fs');
const moment = require('moment-timezone');
const AppError = require('../utils/appError');


const handleJWTError = err => {
  const message = ``;
  return new AppError(message, 400)
}

const handleTokenExpiredError = err => {
  const message = ``;
  return new AppError(message, 400)
}

const handleCastError = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400)
}

const handleDuplicateFieldsDB = err => {
  const message = `Duplicate value: ${err.keyValue.name}. Please use another value`;
  return new AppError(message, 400)
}

const handleValidationError = err => {
  const errors = Object.values(err.errors).map( el => el.message );
  const message = `Invalid Input data. ${ errors.join('. ') }`;
  return new AppError(message, 400)
}

const errDev = (err, res) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
  });
}

const errProd = (err, res) => {
  if (err.isOperational) {
    res.status(500).json({
      status: err.status,
      message: err.message,
    });
  }else{
    res.status(500).json({
      status:'error',
      message: "Something went wrong",
    });
  }
}

module.exports = (err, req, res, next) => {
  // const date = moment.tz('Asia/Kolkata').format('DD-MM-YYYY HH:mm:ss');
  // const data = `[${date}] - ${err.stack}\n`;
  // fs.appendFile(`${__dirname}/../storage/error.log`, data, 'utf-8', (error) => {if(error) {console.log(error)}} )

  if (process.env.NODE_ENV == 'development') {

    let error = Object.assign(err);
    
    if(error.name == 'CastError') error = handleCastError(error)
    if(error.code == 11000) error = handleDuplicateFieldsDB(error)
    if(error.name == 'ValidationError') error = handleValidationError(error)
    if(error.name == 'JsonWebTokenError') error = handleJWTError(error)
    if(error.name == 'TokenExpiredError') error = handleTokenExpiredError(error)

    errDev(error, res);

  }else if(process.env.NODE_ENV == 'production'){
    errProd(err, res);
  }
};
