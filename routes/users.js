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
    const user = User.create({
      email: req.body.email,
      nickname: req.body.nickname,
      gender: req.body.gender,
      password,
      image: req.file.location,
      tag: req.body.tag,
      salt: newSalt,
    })
      .then(result => {
        console.log('데이터 추가 완료');
        res.json({ result });
      })
      .catch(err => {
        console.log('데이터 추가 실패');
        res.json({ err });
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
          console.log(err);
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

          // DB에 refreshToken가 있으면 업데이트
          if (Token.findOne({ userId: user.id })) {
            Token.update(
              { content: refreshToken },
              { where: { userId: user.id } },
            );
            // DB에 refreshToken가 없으면 저장
          } else {
            try {
              Token.create({
                content: refreshToken,
                userId: user.id,
              })
                .then(result => {
                  console.log('데이터 추가 완료');
                })
                .catch(err => {
                  console.log('데이터 추가 실패');
                });
            } catch (error) {
              res.status(500).json({ error });
            }
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
          res.json({ accessToken });
        });
      },
    )(req, res, next);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// 회원 조회 (READ)
router.get('/:id', async (req, res) => {
  const user = await User.findOne({ where: { id: req.params.id } })
    .then(user => {
      if (!user) {
        res.send({ message: '해당 사용자가 없습니다.' });
      } else {
        res.send({ user });
      }
    })
    .catch(error => {
      res.send({ error });
    });
});

// 회원 삭제 (DELETE)
router.delete('/:id', (req, res) => {
  User.destroy({ where: { id: req.body.id } })
    .then(() => {
      res.send({ message: '해당 사용자를 삭제했습니다.' });
    })
    .catch(error => {
      res.send({ error });
    });
});

module.exports = router;
