const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const connect = () => {
  if (process.env.NODE_ENV !== 'production') {
    mongoose.set('debug', true);
  }

  mongoose.connect(
    process.env.mongoURI,
    {
      dbName: 'nodejs',
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    },
    error => {
      if (error) {
        console.log('몽고db 연결 에러', error);
      } else {
        console.log('몽고db 연결 성공', error);
      }
    },
  );
};

mongoose.connection.on('error', error => {
  console.log('몽고db 연결 에러', error);
});

autoIncrement.initialize(mongoose.connection);

module.exports = connect;
