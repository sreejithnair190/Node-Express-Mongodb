const fs = require('fs');

module.exports = (err, req, res, next) => {
  const data = `[${Date.now()}] - ${err.stack}`;
  fs.appendFile(`${__dirname}/../storage/error.log`, data, 'utf-8', (error) => {if(error) {console.log(error)}} )

  const statusCode = err.statusCode || 500;
  const status = err.status || 'Error';

  res.status(statusCode).json({
    status,
    message: err.message,
  });
};
