const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

const notFound = (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} not found`);
  err.status = 'fail';
  err.statusCode = 404;
  next(err);
};

const errHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || 'Something went wrong';

  res.status(statusCode).json({
    status,
    message: err.message,
  });
};

// Middlewares
if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use(express.static(`${__dirname}/public/`));


app.use((req, res, next) => {
  req.requestedTime = new Date().toISOString();
  console.log(req.requestedTime);
  next();
});

// Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', notFound);

app.use(errHandler);

module.exports = app;
