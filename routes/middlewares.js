const passport = require('passport');

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send('로그인 필요');
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send('이미 로그인된 상태');
  }
};

exports.jwtAuthenticater = (req, res, next) => {
  passport.authenticate('jwt', { sessions: false }, (error, user) => {
    // user를 찾았다면 서버에게 요청하는 req객체의 user에 담아서 서버에게 넘겨줌
    if (user) {
      req.user = user;
      console.log('accesstoken 인증 완료');
      next();
    } else {
      console.log('accesstoken 인증 실패');
      next();
    }
  })(req, res, next);
};
