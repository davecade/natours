const Tour = require('./../models/tourModels');

const getAllTours = async (req, res) => {
  try {

    // BUILD QUERY
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);
    const query = Tour.find(queryObj);

    // EXECUTE QUERY
    const tours = await query

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours: tours,
      },
    });
  } catch (e) {
    res.status(404).json({
      status: 'fail',
      mesage: e,
    });
  }
};

const getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    if (tour) {
      res.status(200).json({
        status: 'success',
        data: {
          ...tour,
        },
      });
    }
  } catch (e) {
    res.status(404).json({
      status: 'fail',
      mesage: e,
    });
  }
};

const createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      status: 'fail',
      message: e,
    });
  }
};

const updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'sucess',
      data: {
        tour: tour,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      status: 'fail',
      message: e,
    });
  }
};

const deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      status: 'fail',
      message: e,
    });
  }
};

module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
};
