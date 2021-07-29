const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const { Schema } = mongoose;
const user = new Schema({
  seq: {
    type: Number,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
    maxlength: 10,
  },
  gender: Number,
  password: {
    type: String,
    minlength: 8,
  },
  image: {
    type: String,
    unique: true,
  },
  tag: String,
  level: {
    type: Number,
    required: true,
    default: 1,
  },
  mobumScore: {
    type: Number,
    required: true,
    default: 1,
  },
});

user.plugin(autoIncrement.plugin, {
  model: 'User',
  field: 'seq',
  startAt: 1, // 시작
  increment: 1, // 증가
});

module.exports = mongoose.model('User', user);
