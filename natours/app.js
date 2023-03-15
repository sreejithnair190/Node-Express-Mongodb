const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// Middlewares
app.use(morgan('dev'));

app.use(express.json());

app.use(express.static(`${__dirname}/public/`))

// app.use((req, res, next) => {
//   console.log('UsingMiddleware');
//   next();
// });

app.use((req, res, next) => {
  req.requestedTime = new Date().toISOString();
  console.log(req.requestedTime);
  next();
});

// Routes
app.use('/api/v1/tours', tourRouter); 
app.use('/api/v1/users', userRouter);

module.exports = app; 
