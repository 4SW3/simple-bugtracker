const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.deleteOne = (Model, admView) =>
  catchAsync(async (req, res, next) => {
    let doc = Model.findByIdAndDelete(req.params.id);
    if (admView) doc = doc.comment('admView');
    doc = await doc;

    if (!doc) return next(new AppError('No document found with that ID', 404));

    res.status(204).json({
      status: 'success',
      data: null
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!doc) return next(new AppError('No document found with that ID', 404));

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) return next(new AppError('No document found with that ID', 404));

    res.status(200).json({
      status: 'success',
      data: {
        doc
      }
    });
  });

exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    // Small hack to allow nested GET reviews on specific track
    let options = {};
    if (req.user.role === 'user') options = { deletedComment: { $ne: true } };

    // EXECUTE QUERY
    const features = new APIFeatures(Model.find(options), req.query)
      .filter()
      .sort()
      .limit()
      .paginate();
    const doc = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc
      }
    });
  });

// Needs fixing doc variable
// exports.restrictTCU = Model =>
//   catchAsync(async (req, res, next) => {
//     const doc = await Model.findById(req.params.id);

//     if (!(doc.user._id * 1 === req.user._id * 1)) {
//       if (req.user.role === 'user') {
//         return next(
//           new AppError(
//             'You do not have permission to perform this action!',
//             403
//           )
//         );
//       }
//     }

//     next();
//   });
