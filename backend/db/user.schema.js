const Schema = require('mongoose').Schema;
const bcrypt = require('bcrypt');

exports.UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 1,
    maxlength: 30,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: { 
    type: Boolean, 
    default: false,
  },
  description: {
    type: String,
    default: '',
    maxlength: 200,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },}, { collection: 'Users'});


// Extra Credit: Password Encryption
exports.UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next()
  }; 
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});
