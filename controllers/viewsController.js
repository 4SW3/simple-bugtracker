const User = require('../models/userModel');
const Track = require('../models/trackModel');
const Comment = require('../models/commentModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

const limitTrackText = (text, limit = 90) => {
  const newText = [];

  if (text.length > limit) {
    text.split(' ').reduce((acc, cur) => {
      if (acc + cur.length <= limit) {
        newText.push(cur);
      }
      return acc + cur.length;
    }, 0);

    return `${newText.join(' ')}...`;
  }

  return newText;
};

exports.getOverview = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Track.find(), req.query)
    .filter()
    .sort()
    .limit()
    .paginate();
  const tracks = await features.query;

  tracks.forEach(el => {
    el.title = limitTrackText(el.title, 40);
    el.description = limitTrackText(el.description);
  });

  const { user } = res.locals;
  const docs = await Track.estimatedDocumentCount(); // faster for larger collections
  // Track.countDocuments({}, (err, count) => console.log(count)); // Slower for larger collections

  res.status(200).render('overview', {
    title: 'All Tracks',
    tracks,
    user,
    page: req.query.page ? req.query.page : 1,
    pages: Math.ceil(docs / 9 || req.query.limit) // change order
  });
});

exports.getTrack = catchAsync(async (req, res, next) => {
  const track = await Track.findOne({ slug: req.params.slug }).populate({
    path: 'comments',
    fields: 'user comment'
  });

  if (!track)
    return next(new AppError('There is no track with that name', 404));

  const filteredComments = track.comments.filter(
    el => el.deletedComment !== true
  );

  track.comments = filteredComments;

  res.status(200).render('track', {
    title: 'Track',
    track
  });
});

exports.getLoginForm = (req, res) =>
  res.status(200).render('login', { title: 'Log into your account' });

exports.getForgotPassForm = (req, res) =>
  res.status(200).render('forgotPassword', { title: 'Forgot Password?' });

exports.getResetPassForm = (req, res) =>
  res.status(200).render('resetPassword', { title: 'Reset Password' });

exports.getAccount = (req, res) =>
  res.status(200).render('account', { title: 'Your account' });

exports.getSignUpForm = (req, res) =>
  res.status(200).render('signup', { title: 'Create a new account' });

exports.getCreateTrackForm = (req, res) =>
  res.status(200).render('createTrack', { title: 'Create track' });

exports.getMyTracks = catchAsync(async (req, res, next) => {
  const tracks = await Track.find({ user: req.user.id });

  res.status(200).render('myTracks', {
    title: 'My Tracks',
    tracks
  });
});

exports.getMyComments = catchAsync(async (req, res, next) => {
  const commentss = await Comment.find({ user: req.user.id }).populate({
    path: 'track'
  });

  const comments = commentss.filter(el => {
    return el.track !== null && el.deletedComment !== true;
  });

  res.status(200).render('myComments', {
    title: 'My Comments',
    comments
  });
});

exports.manageTracks = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Track.find(), req.query)
    .filter()
    .sort()
    .limit();
  features.query.comment('admView');
  const tracks = await features.query;

  tracks.forEach(el => {
    el.title = limitTrackText(el.title, 40);
    el.description = limitTrackText(el.description);
  });

  res.status(200).render('manageTracks', {
    title: 'Manage Tracks',
    tracks
  });
});

exports.manageUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().comment('admView');

  res.status(200).render('manageUsers', {
    title: 'Manage Users',
    users
  });
});

exports.manageComments = catchAsync(async (req, res, next) => {
  const comments = await Comment.find().populate({ path: 'track' });

  comments.forEach((el, i) => {
    if (el.track === null) {
      comments[i].track = 'Deleted';
    }
  });

  res.status(200).render('manageComments', {
    title: 'Manage Comments',
    comments
  });
});

exports.searchTracks = catchAsync(async (req, res, next) => {
  const { searchTerm } = req.query;
  if (searchTerm === undefined)
    return next(new AppError('No search term!', 404));

  const trackss = await Track.find();
  const tracks = trackss.filter(el => {
    return (
      el.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      el.description.includes(searchTerm.toLowerCase())
    );
  });

  res.status(200).render('overview', {
    title: 'All Tracks Found',
    tracks
  });
});

// exports.updateUserData = catchAsync(async (req, res, next) => {
//   const updatedUser = await User.findByIdAndUpdate(
//     req.user._id,
//     {
//       name: req.body.name,
//       email: req.body.email
//     },
//     {
//       new: true,
//       runValidators: true
//     }
//   );

//   res
//     .status(200)
//     .render('account', { title: 'Your account', user: updatedUser });
// });
