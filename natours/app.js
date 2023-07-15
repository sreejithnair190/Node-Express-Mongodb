const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const AppError = require('./utils/appError');
const errorHandler = require('./controllers/errorController');

const app = express();

//Setting up views
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Global Middlewares

// Serving Static File
app.use(express.static(path.join( __dirname, 'public')));

// Set Security HTTP Headers
app.use(helmet());

// Logging in Development
if (process.env.NODE_ENV == 'development') app.use(morgan('dev'));

// Limit Requests From Same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from the same IP. Please try again in an hour!',
});
app.use('/api', limiter);

// Body Parser, Reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data Sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data Samitaization against XSS
app.use(xss());

// Prevent Parameter Pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// Routes
app.get( '/', (req, res, next) => res.status(200).render('base',{tour: 'The Forest Hiker', user:'Sreejith'}));
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) =>
  next(new AppError(`Can't find ${req.originalUrl} not found`, 404))
);

app.use(errorHandler);

module.exports = app;
