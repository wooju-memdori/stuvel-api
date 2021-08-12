const express = require('express');
const path = require('path');
const morgan = require('morgan');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const connect = require('./models');
const indexRouter = require('./routes');
const userRouter = require('./routes/users');
const passportConfig = require('./passport');
const {
  accessTokenAuthenticater,
  refreshTokenAuthenticater,
  isNotLoggedIn,
} = require('./routes/middlewares');

const app = express();

// passport strategy 설정 심기
passportConfig();

// mongodb 연결
connect();

// 로그 찍기
app.use(morgan('dev'));

// 정적 파일 경로 설정
app.use(express.static(path.join(__dirname, 'public')));

// body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// cookie-parser
app.use(cookieParser());

// req 객체에 passport 설정 심기
app.use(passport.initialize());

// accessToken 인증 미들웨어
app.use(accessTokenAuthenticater);
// refreshToken 인증 미들웨어
app.use(refreshTokenAuthenticater);

// 라우터 미들웨어
app.use('/', indexRouter);
app.use('/users', userRouter);

// 에러 처리 미들웨어
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  console.log(err);
  res.status(err.status || 500);
  res.send(err);
});

module.exports = app;
