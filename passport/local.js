const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt');
const User = require('../models/User');

// {"userId": "chanyeong", "password": "password"}
// mongoose 조회 기능 살펴보기!!
const passportConfig = { usernameField: 'userId', passwordField: 'password' };

// 사용자의 인증정보 확인하는 함수
const passportVerify = async (userId, password, done) => {
  try {
    // 유저 아이디로 일치하는 유저 데이터 검색
    const user = await User.findOne({ user_id: userId });
    if (!user) {
      done(null, false, { reason: '존재하지 않는 사용자입니다.' });
      return;
    }

    // 검색된 유저 데이터가 있다면 유저 해쉬된 비밀번호 비교
    const compareResult = await bcrypt.compare(password, user.password);

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

// LocalStrategy를 local이란 이름으로 생성
module.exports = () => {
  passport.use('local', new LocalStrategy(passportConfig, passportVerify));
};
