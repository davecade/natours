const express = require('express');
const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
} = require('../controller/tourController');

const router = express.Router();

router.param('id', (req, res, next, val) => {
  console.log("Tour id is:", val)
  next()
})

router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
