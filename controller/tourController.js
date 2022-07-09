const Tour = require('./../models/tourModels');
const APIFeatures = require('../utils/apiFeatures');

const aliasTopTours = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage.price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

const getAllTours = async (req, res) => {
  try {
    // EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

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

const getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
      // {
      //   $match: { _id: { $ne: "EASY" } }
      // }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats,
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

const getMonthlyPlan = async (req, res) => {
  const monthNames = {
    1: 'January',
    2: 'February',
    3: 'March',
    4: 'April',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'December',
  };

  try {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      { $unwind: '$startDates' },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numToursStarts: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: { numToursStarts: -1 },
      },
      {
        $limit: 6,
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        plan,
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

module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
};
