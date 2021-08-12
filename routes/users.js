const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { createSalt, createPassword } = require('../passport/crypto');
const Token = require('../models/Token');
const User = require('../models/User');
const { isNotLoggedIn } = require('./middlewares');
const upload = require('../bin/multer');

const router = express.Router();

// 회원가입
router.post('/signup', upload.single('image'), async (req, res) => {
  try {
    if (!req.body.email || !req.body.nickname || !req.body.password) {
      res.send({
        status: false,
        message: '파일 업로드 실패',
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }

  try {
    const newSalt = await createSalt();
    const { password } = await createPassword(req.body.password, newSalt);
    const userInfo = new User({
      email: req.body.email,
      nickname: req.body.nickname,
      gender: req.body.gender,
      password,
      image: req.file.location,
      tag: req.body.tag,
      salt: newSalt,
    });

    userInfo.save((err, doc) => {
      if (err) {
        console.error(err);
        res.json({ message: '생성 실패' });
        return;
      }
      res.json({ message: '생성 완료!' });
    });
  } catch (err) {
    res.status(500).send(err);
    console.log(err);
  }
});

// 로그인 (로그아웃상태에서만 접근 가능)
router.post('/login', isNotLoggedIn, (req, res, next) => {
  try {
    // 'local' 전략 수행 후 성공/실패 시 호출되는 커스텀 콜백 구현
    passport.authenticate(
      'local',
      { session: false },
      async (err, user, info) => {
        if (err || !user) {
          res.status(400).json({ message: info.reason });
          return;
        }
        // user 데이터를 통해 로그인 진행
        req.login(user, { session: false }, loginError => {
          if (loginError) {
            res.send(loginError);
            return;
          }
          // refreshToken 발급
          const refreshToken = jwt.sign(
            { userSeq: user.seq },
            process.env.JWT_SECRET,
            {
              expiresIn: '14d',
            },
          );

          // DB에 refreshToken 저장
          const token = new Token({
            content: refreshToken,
            userSeq: user.seq,
          });

          try {
            token.save();
          } catch (error) {
            res.status(500).json({ error });
          }
          // accessToken 발급
          const accessToken = jwt.sign(
            { userSeq: user.seq },
            process.env.JWT_SECRET,
            {
              expiresIn: '15m',
            },
          );
          console.log(accessToken);
          // refreshToken 쿠키로 보내고 accessToken json payload로 보내기
          res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 14,
          });
          res.json({ accessToken });
        });
      },
    )(req, res, next);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// // 회원 조회 (READ)
// router.get('/user/:nickname', (req, res) => {
//   User.findOne({ nickname: req.params.nickname }, (err, user) => {
//     if (err) return res.status(500).json({ error: err });
//     if (!user)
//       return res
//         .status(404)
//         .json({ error: '해당 닉네임을 가진 유저가 존재하지 않습니다.' });
//     return res.json(user);
//   });
// });

// // 회원 삭제 (DELETE)
// router.delete('/delete', (req, res) => {
//   User.remove({ email: req.body.email }, (err, output) => {
//     if (err) return res.status(500).json({ error: 'Database Failure!' });

//     res.json({ message: '삭제 완료' });

//     res.status(204).end();
//   });
// });

module.exports = router;
