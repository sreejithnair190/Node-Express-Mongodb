const express = require('express');
const fs = require('fs');
const morgan = require('morgan');


const app = express();

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.use(morgan('dev'));

app.use(express.json());

app.use((req, res, next) => {
  console.log("UsingMiddleware");
  next();
});


app.use((req, res, next) => {
  req.requestedTime = new Date().toISOString();
  console.log(req.requestedTime);
  next();
});

const get_tours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

const get_tour = (req, res) => {
  const id = req.params.id * 1;
  const getTourById = tours.find((tour) => tour.id === id);

  if (!getTourById) {
    return res.status(404).json({
      status: 'error',
      message: 'Tour Not Found',
    });
  }

  res.status(200).json({
    status: 'success',
    requestedTime: req.requestedTime,
    data: {
      tour: getTourById,
    },
  });
};

const create_tour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).send({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const update_tour = (req, res) => {
  const id = req.params.id * 1;
  const getTourById = tours.find((tour) => tour.id === id);
  if (!getTourById) {
    return res.status(404).json({
      status: 'error',
      message: 'Tour Not Found',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: getTourById,
    },
  });
};

const delete_tour = (req, res) => {
  const id = req.params.id * 1;
  const getTourById = tours.find((tour) => tour.id === id);
  if (!getTourById) {
    return res.status(404).json({
      status: 'error',
      message: 'Tour Not Found',
    });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

app
  .route('api/v1/tours')
  .get(get_tours)           // gET ALL TOURS
  .post(create_tour);       // CREATE A TOUR

app
  .route('/api/v1/tours/:id')
  .get(get_tour)        // GET TOUR BY ID
  .patch(update_tour)   // UPDATE A TOUR
  .delete(delete_tour); // DELETE A TOUR

// Create Server
const port = 8000;
app.listen(port, () => console.log(`App is running on port ${port}`));
