const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
    trim: true,
    maxlength: [45, 'A user must have less than 45 characters'],
    minlength: [1, 'A user must have more than 1 characters']
  },
  email: {
    type: String,
    required: [true, 'A user must have an email'],
    trim: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  photo: {
    type: String,
    default: 'default.jpg'
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'owner'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'A user must have a password'],
    minlength: [8, 'Password must have at least 8 characters'],
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'A user must confirm the password'],
    validate: {
      // This only works on CREATE and SAVE!
      validator: function(el) {
        return el === this.password; // el stands for this.passwordConfirm
      },
      message: 'Passwords are not the same!'
    }
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  }
});

userSchema.pre('save', async function(next) {
  // Only run this function if password is modified
  if (!this.isModified('password')) return next();
  // Hash password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // passwordConfirm is just a required input
  // it's not required to be persisted to the DB
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function(next) {
  if (this.options.comment === 'admView') this.find();
  else this.find({ active: { $ne: false } });
  this.start = Date.now();
  next();
});

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  // console.log('candidatePassword: ', candidatePassword);
  // console.log('userPassword: ', userPassword);
  // candidate password is the one comming from req.body
  // userPassword is the one stored in the DB
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    // console.log(JWTTimestamp, changedTimeStamp);
    return JWTTimestamp < changedTimeStamp;
  }

  // false means not changed
  return false;
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // it's in miliseconds

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
