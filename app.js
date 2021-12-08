const express = require('express');
const fs = require('fs');

const app = express();

app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//-- sends back all the tours
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours,
    },
  });
});

app.get('/api/v1/tours/:id', (req, res) => {
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
});

app.post('/api/v1/tours', (req, res) => {
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
});

app.patch('/api/v1/tours/:id', (req, res) => {

  if (Number(req.params.id) > tours.length - 1) {
    return res.status(404).json({
      status: '404 Not FOund',
      message: 'Invalid ID'
    });
  }

  res.status(200).json({
    status: 'sucess',
    data: {
      tour: 'updated tour here',
    },
  });
});

const port = 4000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
