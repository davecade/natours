const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

const app = express();

//-- Middlewares
app.use(morgan('dev'));

app.use(express.json());

app.use((req, res, next) => {
  console.log('Hello from the middleware');
  next();
});

app.use((req, res, next) => {
  console.log('Time set');
  req.requestTime = new Date().toISOString();
  next();
});

//-- Route handlers
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
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

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

//-- Routes
const tourRouter = express.Router();
const userRouter = express.Router();

tourRouter.route('/').get(getAllTours).post(createTour);
tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);
userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

const port = 4000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
