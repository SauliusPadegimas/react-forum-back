const mongoose = require('mongoose');

const { Schema } = mongoose;

const Topic = new Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
  },
  discussions: [String],
});

module.exports = mongoose.model('Topic', Topic, 'Topics');
