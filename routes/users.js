const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const Token = require('../models/Token');
const User = require('../models/User');
const { isNotLoggedIn } = require('./middlewares');

const router = express.Router();

// 로그인 (로그아웃상태에서만 접근 가능)
router.post('/login', isNotLoggedIn, (req, res, next) => {
  try {
    // 'local' 전략 수행 후 성공/실패 시 호출되는 커스텀 콜백 구현
    passport.authenticate(
      'local',
      { session: false },
      async (err, user, info) => {
        if (err) {
          res.send(err);
          return next(err);
        }
        // user에 정보가 없으면 로그인 실패
        if (!user) {
          return res.redirect('./login');
        }

        // user 데이터를 통해 로그인 진행
        return req.login(user, { session: false }, loginError => {
          if (loginError) {
            return res.send(err);
          }

          // refreshToken 발급
          const refreshToken = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            {
              expiresIn: '14d',
            },
          );

          // DB에 refreshToken 저장
          const token = new Token({
            content: refreshToken,
            userId: user.id,
          });
          try {
            token.save();
          } catch (error) {
            res.status(500).json({ error });
          }

          // accessToken 발급
          const accessToken = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            {
              expiresIn: '15m',
            },
          );

          // refreshToken 쿠키로 보내고 accessToken json payload로 보내기
          res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 14,
          });
          return res.json({ accessToken });
        });
      },
    )(req, res, next);
  } catch (err) {
    res.send(err);
    next(err);
  }
});

// 회원 조회 (READ)
router.get('/user/:nickname', (req, res) => {
  User.findOne({ nickname: req.params.nickname }, (err, user) => {
    if (err) return res.status(500).json({ error: err });
    if (!user)
      return res
        .status(404)
        .json({ error: '해당 닉네임을 가진 유저가 존재하지 않습니다.' });
    return res.json(user);
  });
});

module.exports = router;
