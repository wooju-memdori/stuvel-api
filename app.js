const express = require('express');
const path = require('path');
const morgan = require('morgan');
const passport = require('passport');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { sequelize } = require('./models');
const indexRouter = require('./routes');
const userRouter = require('./routes/users');
const roomRouter = require('./routes/room');
const followRouter = require('./routes/follow');
const passportConfig = require('./passport');
const {
  accessTokenAuthenticater,
  isLoggedIn,
} = require('./routes/middlewares');

const app = express();

// passport strategy 설정 심기
passportConfig();

// 로그 찍기
app.use(morgan('dev'));

const corsOptions = {
  origin: process.env.STUVEL_CLIENT,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

app.use(cors(corsOptions));

// 정적 파일 경로 설정
app.use(express.static(path.join(__dirname, 'public')));

// body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

sequelize
  .sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch(err => {
    console.log(err);
  });

// cookie-parser
app.use(cookieParser());

// req 객체에 passport 설정 심기
app.use(passport.initialize());

// accessToken 인증 미들웨어
app.use(accessTokenAuthenticater);

// refreshToken 인증 미들웨어
// app.use(refreshTokenAuthenticater);

// 라우터 미들웨어
app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/room', isLoggedIn, roomRouter);
app.use('/', isLoggedIn, followRouter);
// g
// 뷰 엔진
app.set('view engine', 'ejs');

// 에러 처리 미들웨어
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  console.log(err);
  res.status(err.status || 500);
  res.send(err);
});

module.exports = app;
