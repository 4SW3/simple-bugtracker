const Comment = require('../models/commentModel');
// const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.setUserTrackId = (req, res, next) => {
  if (!req.body.track) req.body.track = req.params.trackId;
  // req.body.track = req.params.trackId;
  req.body.user = req.user._id;
  next();
};

exports.restrictCmtUser = catchAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment.user && req.user.role !== 'user') {
    return next();
  }

  if (!comment.user && req.user.role === 'user') {
    return next(
      new AppError('You do not have permission to perform this action!', 403)
    );
  }

  // Quill converted the id to [Object] type
  if (!(JSON.stringify(comment.user._id) === JSON.stringify(req.user._id))) {
    if (req.user.role === 'user') {
      return next(
        new AppError('You do not have permission to perform this action!', 403)
      );
    }
  }

  req.checkUser = true;
  next();
});
exports.check = catchAsync(async (req, res, next) => {
  const check = req.checkUser;
  res.status(200).json({
    status: 'success',
    data: {
      check
    }
  });
});

exports.hideOne = catchAsync(async (req, res, next) => {
  await Comment.findByIdAndUpdate(req.params.id, {
    deletedComment: true
  });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getAllCmtsForTrack = catchAsync(async (req, res, next) => {
  const comments = await Comment.find({ track: req.params.trackId }).comment(
    'cmtView'
  );

  res.status(200).json({
    status: 'success',
    data: {
      comments
    }
  });
});

exports.getAllComments = factory.getAll(Comment);
exports.getComment = factory.getOne(Comment);
exports.createComment = factory.createOne(Comment);
exports.updateComment = factory.updateOne(Comment);
exports.deleteComment = factory.deleteOne(Comment);

exports.deleteAllCmtsForUser = catchAsync(async (req, res, next) => {
  const query = await Comment.find().populate({ path: 'track' });

  query.forEach(async el => {
    if (el.user === null || el.track === null)
      await Comment.findByIdAndDelete(el._id);
  });

  res.status(204).json({
    status: 'success',
    data: null
  });
});
