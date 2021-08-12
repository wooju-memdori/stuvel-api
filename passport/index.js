const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const { ExtractJwt, Strategy: JWTStrategy } = require('passport-jwt');
const { createPassword } = require('./crypto');
const User = require('../models/User');

// {"email": "chanyeong", "password": "password"}
// mongoose 조회 기능 살펴보기!!
const passportConfig = { usernameField: 'email', passwordField: 'password' };

// 사용자의 인증정보 확인하는 함수
const passportVerify = async (email, password, done) => {
  try {
    console.log('passportVerify');
    // 유저 아이디로 일치하는 유저 데이터 검색
    const user = await User.findOne({ email });
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
      console.log('로그인 인증은 됩니다.');
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
const JWTConfig = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 헤더의 authorization에서 jwt 가져오기
  secretOrKey: process.env.JWT_SECRET,
};

// jwt 인증 strategy
const JWTVerify = async (jwtPayload /* 토큰의 데이터 부분 */, done) => {
  try {
    // payload의 id값으로 유저의 데이터 조회
    const user = await User.findOne({ seq: jwtPayload.userSeq });
    // 유저 데이터가 있다면 유저 데이터 객체 전송
    if (user) {
      done(null, user);
      return;
    }
    // 유저 데이터가 없을 경우 에러 표시
    done(null, false, { reason: '올바르지 않은 인증정보 입니다.' });
  } catch (error) {
    console.error(error);
    done(error);
  }
};

module.exports = () => {
  passport.use('jwt', new JWTStrategy(JWTConfig, JWTVerify));
  passport.use('local', new LocalStrategy(passportConfig, passportVerify));
};
