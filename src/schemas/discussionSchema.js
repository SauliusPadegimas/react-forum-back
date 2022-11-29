const mongoose = require('mongoose');

const { Schema } = mongoose;

const Discussion = new Schema({
  title: {
    type: String,
    required: true,
    minLength: 3,
  },
  posts: [String],
  author: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Discussion', Discussion, 'Discussions');
