const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const { ExtractJwt, Strategy: JWTStrategy } = require('passport-jwt');
const jwt = require('jsonwebtoken');
const { Strategy: CustomStrategy } = require('passport-custom');
const { createPassword } = require('./crypto');
const User = require('../models/User');
const Token = require('../models/Token');

// {"email": "chanyeong", "password": "password"}
// mongoose 조회 기능 살펴보기!!
const passportConfig = { usernameField: 'email', passwordField: 'password' };

// 사용자의 인증정보 확인하는 함수
const passportVerify = async (email, password, done) => {
  try {
    // 유저 아이디로 일치하는 유저 데이터 검색
    const user = await User.findOne({ where: { email } });
    if (!user) {
      done(null, false, { reason: '존재하지 않는 사용자입니다.' });
      return;
    }

    // 검색된 유저 데이터가 있다면 유저 해쉬된 비밀번호 비교
    const { password: inputPassword } = await createPassword(
      password,
      user.salt,
    );
    const compareResult = inputPassword === user.password;

    // 해쉬된 비밀번호가 같다면 유저 데이터 객체 전송
    if (compareResult) {
      done(null, user);
      return;
    }

    // 비밀번호가 다를 경우 에러 표시
    done(null, false, { reason: '올바르지 않은 비밀번호입니다.' });
  } catch (err) {
    console.error(err);
    done(err);
  }
};

// jwt 인증 config
const accessTokenConfig = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 헤더의 authorization에서 jwt 가져오기
  secretOrKey: process.env.JWT_SECRET,
};

// accessToken 인증 strategy
const accessTokenVerify = async (jwtPayload /* 토큰의 데이터 부분 */, done) => {
  try {
    // payload의 id값으로 유저의 데이터 조회
    const user = await User.findOne({ where: { id: jwtPayload.userId } });
    // 유저 데이터가 있다면 유저 데이터 객체 전송
    if (user) {
      done(null, user);
      return;
    }
    // 유저 데이터가 없을 경우 에러 표시
    done(null, false, { reason: '올바르지 않은 accessToken 입니다.' });
  } catch (error) {
    console.error(error);
    done(error);
  }
};

// refreshToken 인증 strategy
const refreshTokenVerify = async (req, done) => {
  if (!req.cookies.refreshToken) {
    console.log('refreshToken 없음');
    done(null, false, { reason: 'refreshToken 없음' });
    return;
  }
  const refreshToken = await Token.findOne({
    where: {
      content: req.cookies.refreshToken,
    },
  });
  try {
    const decoded = jwt.verify(
      req.cookies.refreshToken,
      process.env.JWT_SECRET,
    );
    if (!refreshToken || !decoded) {
      console.log('올바르지 않은 refreshToken 입니다.');
      done(null, false, { reason: '올바르지 않은 refreshToken 입니다.' });
      return;
    }
  } catch (err) {
    console.log(err);
    done(null, false, { reason: '올바르지 않은 refreshToken 입니다.' });
    return;
  }
  const user = await User.findOne({ where: { id: refreshToken.userId } });
  done(null, user);
};

module.exports = () => {
  passport.use(
    'accessToken',
    new JWTStrategy(accessTokenConfig, accessTokenVerify),
  );
  passport.use('refreshToken', new CustomStrategy(refreshTokenVerify));
  passport.use('local', new LocalStrategy(passportConfig, passportVerify));
};
