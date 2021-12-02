const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { createSalt, createPassword } = require('../passport/crypto');
const Token = require('../models/Token');
const User = require('../models/User');
const Tag = require('../models/Tag');
const UserTag = require('../models/UserTag');
const { isNotLoggedIn, isLoggedIn } = require('./middlewares');
const upload = require('../bin/multer');
const { success, failed } = require('../common/response');

const router = express.Router();

// 회원가입
router.post(
  '/signup',
  isNotLoggedIn,
  upload.single('image'),
  async (req, res) => {
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
        image: req.file?.location,
        salt: newSalt,
      })
        .then(result => {
          console.log('데이터 추가 완료');
          res.json({ result });
        })
        .catch(err => {
          console.log('데이터 추가 실패');
          if (err.name === 'SequelizeUniqueConstraintError') {
            res.status(409).send(failed(err, 409));
          }
          res.status(500).send(failed(err));
        });
    } catch (err) {
      res.status(500).send(failed(err));
      console.log(err);
    }
  },
);

// 로그인 (로그아웃상태에서만 접근 가능)
router.post('/login', isNotLoggedIn, (req, res, next) => {
  try {
    // 'local' 전략 수행 후 성공/실패 시 호출되는 커스텀 콜백 구현
    passport.authenticate(
      'local',
      { session: false },
      async (err, user, info) => {
        if (err || !user) {
          res.json({ message: info.reason });
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
          // DB에 refreshToken가 있으면 업데이트, 없으면 저장
          Token.findOne({ where: { userId: user.id } }).then(result => {
            if (result) {
              Token.update(
                { content: refreshToken, userId: user.id },
                { where: { userId: user.id } },
              );
            } else {
              Token.create({
                content: refreshToken,
                userId: user.id,
              })
                .then(() => {
                  console.log('데이터 추가 완료');
                })
                .catch(error => {
                  console.log(error);
                  console.log('데이터 추가 실패');
                });
            }
          });

          // accessToken 발급
          const accessToken = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            {
              expiresIn: '2d',
            },
          );
          // refreshToken 쿠키로 보내고 accessToken json payload로 보내기
          res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 14,
          });
          res.json({ accessToken, userId: user.id });
        });
      },
    )(req, res, next);
  } catch (err) {
    console.log(err);
    res.send(failed(err));
  }
});

// accessToken 연장
router.post('/silent-refresh', (req, res, next) => {
  // 'local' 전략 수행 후 성공/실패 시 호출되는 커스텀 콜백 구현
  passport.authenticate('refreshToken', { sessions: false }, (error, user) => {
    if (user) {
      const accessToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        {
          expiresIn: '2d',
        },
      );
      res.json({ accessToken });
    } else {
      console.log('refreshToken 인증 실패');
      res.status(401).send({ message: 'refreshToken 유효하지 않음' });
    }
  })(req, res, next);
});

// 내 정보 조회 (READ)
router.get('/', isLoggedIn, async (req, res) => {
  try {
    if (req.user.dataValues.id) {
      const user = await User.findOne({
        where: { id: req.user.dataValues.id },
        attributes: [
          'nickname',
          'email',
          'image',
          'gender',
          'mobumScore',
          'description',
        ],
      });
      const tags = await UserTag.findAll({
        where: req.user.dataValues.id,
        attributes: ['tag_id'],
        include: [
          {
            model: Tag,
            attributes: ['id', 'name', 'category'],
          },
        ],
      });
      if (user && tags) {
        const fullUser = user.toJSON();
        fullUser.tag = tags;
        res.status(200).send(success(fullUser));
      } else {
        res.status(404).send('나의 정보를 찾지 못했습니다.');
      }
    } else {
      res.status(200).json(null);
    }
  } catch (error) {
    console.error(error);
    res.send(failed(error));
  }
});

// 회원 조회 (READ)
router.get('/:id', isLoggedIn, async (req, res) => {
  await User.findOne({ where: { id: req.params.id } })
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

// 로그아웃 (로그인상태에서만 접근 가능)
router.delete('/logout', isLoggedIn, (req, res, next) => {
  Token.destroy({ where: { userId: req.user.id } })
    .then(() => {
      res.send(success());
    })
    .catch(err => {
      res.send(failed(err));
    });
});

// 회원 삭제 (DELETE)
router.delete('/:id', isLoggedIn, (req, res) => {
  Token.destroy({ where: { userId: req.params.id } });
  User.destroy({ where: { id: req.params.id } })
    .then(() => {
      res.send({ message: '해당 사용자를 삭제했습니다.' });
    })
    .catch(error => {
      res.send({ error });
    });
});

// 닉네임 및 소개글 변경
router.patch('/personal-info', isLoggedIn, async (req, res) => {
  try {
    await User.update(
      {
        nickname: req.body.nickname,
        description: req.body.description,
      },
      {
        where: { id: req.user.dataValues.id },
      },
    );
    res.status(200).json(req.body);
  } catch (error) {
    console.error(error);
    res.send(failed(error));
  }
});

// 관심사 변경
router.patch('/interests', isLoggedIn, async (req, res) => {
  try {
    await UserTag.destroy({
      where: {
        user_id: req.user.dataValues.id,
      },
    });
    const promisesToRun = req.body.map(tag =>
      UserTag.create({
        // userId: req.user.dataValues.id,
        user_id: req.user.dataValues.id,
        // tagId: +tag,
        tag_id: +tag,
      }),
    );
    await Promise.all(promisesToRun);
    res.status(200).json(req.body);
  } catch (err) {
    console.error(err);
    res.status(500).send(failed(err.message));
  }
});

// 비밀번호 변경
router.patch('/password', isLoggedIn, async (req, res) => {
  try {
    passport.authenticate(
      'local',
      { session: false },
      async (err, user, info) => {
        if (err) {
          // server err
          return res.status(500).send(err.message);
        }
        if (info) {
          // client err
          return res.status(401).send(info.reason);
        }
        const newSalt = await createSalt();
        const { password } = await createPassword(
          req.body.newPassword,
          newSalt,
        );
        await User.update(
          {
            password,
            salt: newSalt,
          },
          {
            where: { id: req.user.dataValues.id },
          },
        );

        return res.status(200).send('비밀번호 변경 완료');
      },
    )(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// 프로필 사진 업로드
router.patch('/profileimage', upload.single('image'), async (req, res) => {
  try {
    console.log('file ::: ', req.file);
    console.log(req.file.location);

    await User.update(
      {
        image: req.file.location,
      },
      {
        where: { id: req.user.dataValues.id },
      },
    );
    res.status(200).send(req.file.location);
  } catch (err) {
    console.error(err);

    res.status(500).send(err);
  }
});

module.exports = router;
