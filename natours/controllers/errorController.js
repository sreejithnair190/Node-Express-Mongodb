const fs = require('fs');
const moment = require('moment-timezone');
const AppError = require('../utils/appError');

const errDev = (err, res) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    statusCode: statusCode,
    // error: err,
    // status: statusCode,
    // message: err.message,
    // stack: err.stack
  });
}

const errProd = (err, res) => {
  let status = 500;
  let message = "Something went wrong"; 
  if (err.isOperational) {
   status = err.status
   message = err.message;
  }else{
    console.log(err);
  }
  res.status(statusCode).json({
    status,
    message: message,
  });
}

module.exports = (err, req, res, next) => {
  // console.log(err);
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';

  res.status(statusCode).json({
    status,
    message:err.message
  })

  // const date = moment.tz('Asia/Kolkata').format('DD-MM-YYYY HH:mm:ss');
  // const data = `[${date}] - ${err.stack}\n`;
  // fs.appendFile(`${__dirname}/../storage/error.log`, data, 'utf-8', (error) => {if(error) {console.log(error)}} )

  // const statusCode = err.statusCode || 500;
  // const status = err.status || 'Error';

  // if (process.env.NODE_ENV == 'development') {
  //   errDev(err, res);
  // }else if(process.env.NODE_ENV == 'production'){
  //   errProd(err, res);
  // }
};
