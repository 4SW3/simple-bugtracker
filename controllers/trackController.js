const Track = require('../models/trackModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');

exports.aliasByName = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'title,category';
  req.query.fields = 'title,category,priority,status';
  next();
};

exports.setUserId = (req, res, next) => {
  // if (!req.body.user) req.body.user = req.user.id;
  req.body.user = req.user.id;
  next();
};

exports.restrictTrackUser = catchAsync(async (req, res, next) => {
  const track = await Track.findById(req.params.id);

  if (!track.user && req.user.role !== 'user') {
    return next();
  }

  if (!track.user && req.user.role === 'user') {
    return next(
      new AppError('You do not have permission to perform this action!', 403)
    );
  }

  if (!(JSON.stringify(track.user._id) === JSON.stringify(req.user._id))) {
    if (req.user.role === 'user') {
      return next(
        new AppError('You do not have permission to perform this action!', 403)
      );
    }
  }

  next();
});

exports.hideOne = catchAsync(async (req, res, next) => {
  await Track.findByIdAndUpdate(req.params.id, { closedTrack: true });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getTrack2 = catchAsync(async (req, res, next) => {
  const track = await Track.findById(req.params.id).populate({
    path: 'comments'
  });

  if (!track) return next(new AppError('No document found with that ID', 404));

  req.track = track;
  next();
});

exports.filterDelCmts = catchAsync(async (req, res, next) => {
  const comments = req.track.comments.filter(el => el.deletedComment !== true);

  const { track } = req;
  track.comments = comments;

  res.status(200).json({
    status: 'success',
    data: {
      track
    }
  });
});

exports.getAllTracks = factory.getAll(Track);
exports.getTrack = factory.getOne(Track, { path: 'comments' });
exports.createTrack = factory.createOne(Track);
exports.updateTrack = factory.updateOne(Track);
exports.deleteTrack = factory.deleteOne(Track, true);

exports.deleteAllTrksForUser = catchAsync(async (req, res, next) => {
  const query = await Track.find();

  query.forEach(async el => {
    if (el.user === null) await Track.findByIdAndDelete(el._id);
  });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.searchTracks = catchAsync(async (req, res, next) => {
  const { searchTerm } = req.query;
  if (searchTerm === undefined)
    return next(new AppError('No search term!', 404));

  const tracks = await Track.find();
  const results = tracks.filter(el => {
    return (
      el.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      el.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  res.status(200).json({
    status: 'success',
    data: {
      data: results
    }
  });
});

// exports.getTrackStats = catchAsync(async (req, res, next) => {
//   const stats = await Track.aggregate([
//     {
//       $match: { priorityAsNum: { $gte: 1 } }
//     },
//     {
//       $group: {
//         _id: { $toUpper: '$priority' },
//         // _id: '$priority',
//         numOfTracks: { $sum: 1 },
//         sumOfPriors: { $sum: '$priorityAsNum' },
//         avgPrior: { $avg: '$priorityAsNum' },
//         minPrior: { $min: '$priorityAsNum' },
//         maxPrior: { $max: '$priorityAsNum' }
//       }
//     },
//     {
//       $sort: { numOfTracks: 1 }
//     }
//     // {
//     //   $match: { _id: { $ne: 'HIGH' } }
//     // }
//   ]);

//   res.status(200).json({
//     status: 'success',
//     data: {
//       stats
//     }
//   });
// });
