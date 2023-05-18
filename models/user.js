const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // User name
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  // User info
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  // User avatar
  avatar: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);
