const mongoose = require('mongoose');

const { Schema } = mongoose;
const tokenSchema = new Schema({
  content: {
    type: String,
    unique: true,
    required: true,
  },
  userId: {
    type: Number,
    unique: true,
    required: true,
  },
});

module.exports = mongoose.model('User', tokenSchema);
