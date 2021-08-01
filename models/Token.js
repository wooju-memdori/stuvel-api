const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const { Schema } = mongoose;
const token = new Schema({
  seq: {
    type: Number,
    unique: true,
    required: true,
  },
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

module.exports = mongoose.model('Token', token);

token.plugin(autoIncrement.plugin, {
  model: 'Token',
  field: 'seq',
  startAt: 1, // 시작
  increment: 1, // 증가
});
