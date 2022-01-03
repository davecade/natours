const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours: tours,
    },
  });
};

const getTour = (req, res) => {
  if (Number(req.params.id) > tours.length - 1) {
    return res.status(404).json({
      status: '404 Not FOund',
    });
  }

  const tour = tours.find((item) => item.id === Number(req.params.id));
  if (tour) {
    res.status(200).json({
      status: 'success',
      data: {
        ...tour,
      },
    });
  }
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  console.log(req.body);
  const newTour = {
    id: newId,
    ...req.body,
  };

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
  if (Number(req.params.id) > tours.length - 1) {
    return res.status(404).json({
      status: '404 Not FOund',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'sucess',
    data: {
      tour: 'updated tour here',
    },
  });
};

const deleteTour = (req, res) => {
  if (Number(req.params.id) > tours.length - 1) {
    return res.status(404).json({
      status: '404 Not FOund',
      message: 'Invalid ID',
    });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

module.exports = { getAllTours, getTour, createTour, updateTour, deleteTour };
