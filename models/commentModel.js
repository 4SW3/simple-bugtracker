const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, 'A comment can not be empty!'],
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    deletedComment: {
      type: Boolean,
      default: false
    },
    track: {
      type: mongoose.Schema.ObjectId,
      ref: 'Track',
      required: [true, 'A comment must belong to a track!']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A comment must belong to a user!']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
    // id: false // disable the virtual getter
  }
);

commentSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name photo'
  });
  // .populate({
  //   path: 'track',
  //   select: 'title'
  // });

  next();
});

// commentSchema.pre(/^find/, function(next) {
//   this.find({ deletedComment: { $ne: true } });

//   next();
// });

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
