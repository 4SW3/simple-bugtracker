const mongoose = require('mongoose');
const slugify = require('slugify');

const trackSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A track must have a title!'],
      unique: true,
      trim: true,
      maxlength: [50, 'Title must be less than 50 characters!'],
      minlength: [5, 'Title must have more than 5 characters!']
    },
    slug: String,
    priority: {
      type: String,
      default: 'Normal',
      enum: {
        values: ['Low', 'Normal', 'High'],
        message: 'Priority must be either Low, Normal or High!'
      }
    },
    description: {
      type: String,
      required: [true, 'A track must have a description!'],
      trim: true
    },
    category: {
      type: String,
      default: 'null',
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    status: {
      type: String,
      default: 'Open'
    },
    closedTrack: {
      type: Boolean,
      default: false
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A track must belong to a user!']
    }
    // comments: [
    //   {
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'Comment'
    //   }
    // ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Document middleware
// Virtual properties on the schema won't be saved in the DB
// trackSchema.virtual('testField').get(function() {
//   this.test = this.status === 'Resolved' ? 'Fechou Brow' : 'ahham';
//   return this.test;
// });

// Virtual populate
trackSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'track',
  localField: '_id'
});

trackSchema.pre(/^find/, function(next) {
  // this.populate({
  //   path: 'track',
  //   select: 'title'
  // }).populate({
  //   path: 'user',
  //   select: 'name photo'
  // });

  this.populate({
    path: 'user',
    select: 'name photo'
  });

  next();
});

trackSchema.index({ slug: 1 });

// Document middleware: runs before the .save() command and the .create()
trackSchema.pre('save', function(next) {
  this.slug = slugify(this.title, { lower: true });
  this.title = this.title.charAt(0).toUpperCase() + this.title.slice(1);
  next();
});

// Query middleware
// PS /^find execute the query for all the strings that starts with find
trackSchema.pre(/^find/, function(next) {
  if (this.options.comment === 'admView') this.find();
  else this.find({ closedTrack: { $ne: true } });
  // this.start = Date.now();
  next();
});

// trackSchema.post(/^find/, function(docs, next) {
//   console.log(`Query took ${Date.now() - this.start} milliseconds!`);
//   next();
// });

// Aggregation middleware
// trackSchema.pre('aggregate', function(next) {
//   this.pipeline().unshift({ $match: { closedTrack: { $ne: true } } });
//   next();
// });

const Track = mongoose.model('Track', trackSchema);

module.exports = Track;
