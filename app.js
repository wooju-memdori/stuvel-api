const express = require('express');
const path = require('path');
const morgan = require('morgan');
const passport = require('passport');
const connect = require('./models');
const indexRouter = require('./routes');
const userRouter = require('./routes/users');
const passportConfig = require('./passport/local');

const app = express();

passportConfig();
connect();
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/users', userRouter);

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.send(err);
});

module.exports = app;
