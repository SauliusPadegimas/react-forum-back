const mongoose = require('mongoose');

const { Schema } = mongoose;

const Post = new Schema({
  text: {
    type: String,
    required: true,
    minLength: 1,
  },
  reply: {
    type: String,
    default: null,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  author: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Post', Post, 'Posts');
