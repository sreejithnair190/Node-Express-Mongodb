const fs = require('fs');
const moment = require('moment-timezone');

module.exports = (err, req, res, next) => {
  const date = moment.tz('Asia/Kolkata').format('DD-MM-YYYY HH:mm:ss');
  const data = `[${date}] - ${err.stack}\n`;
  fs.appendFile(`${__dirname}/../storage/error.log`, data, 'utf-8', (error) => {if(error) {console.log(error)}} )

  const statusCode = err.statusCode || 500;
  const status = err.status || 'Error';

  res.status(statusCode).json({
    status,
    message: err.message,
  });
};
