const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkId = (req, res, next, val) => {
  const id = req.params.id * 1;
  if (id > tours.length) {
    return res.status(404).json({
      status: 'error',
      message: 'Tour Not Found',
    });
  }
  next();
}

exports.validate = (req, res, next) => {
  if(!(req.body.name && req.body.price)){
    return res.status(404).json({
      status: 'error',
      message: 'Field is required',
    });
  }
  next();
}

exports.get_tours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

exports.get_tour = (req, res) => {
  
  const id = req.params.id * 1;
  const tour = tours.find(el => el.id === id);
  res.status(200).json({
    status: 'success',
    requestedTime: req.requestedTime,
    data: {
      tour,
    },
  });
};

exports.create_tour = (req, res) => {
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

exports.update_tour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find(el => el.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

exports.delete_tour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
