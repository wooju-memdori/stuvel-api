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

mongoose.connection.on('disconnected', () => {
  console.log('몽고db 연결이 끊어졌습니다. 연결을 재시도합니다.');
  connect();
});

autoIncrement.initialize(mongoose.connection);

module.exports = connect;
