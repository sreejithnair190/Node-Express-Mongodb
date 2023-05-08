const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const errorHandler = require('./controllers/errorController');

const app = express();

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

app.all('*', (req, res, next) => next(new AppError(`Can't find ${req.originalUrl} not found`, 404)));

app.use(errorHandler);

module.exports = app;
