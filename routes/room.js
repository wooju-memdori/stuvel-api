const express = require('express');
const { v4: uuidV4 } = require('uuid');
const { Op } = require('sequelize');
const Room = require('../models/Room');
const User = require('../models/User');

const router = express.Router();

// 매칭(기존 방에서 자리를 찾고 없으면 방 새로 생성)
router.get('/', async (req, res) => {
  Room.findAndCountAll({
    where: { joined_count: { [Op.lt]: 4 } },
  })
    .then(({ count, rows }) => {
      console.log('count', count);
      console.log('rows', rows);
      // 자리가 있는 방이 하나도 없을 때
      if (count === 0) {
        const roomId = uuidV4();

        Room.create({
          id: roomId,
          joined_count: 0,
        })
          .then(() => {
            console.log('데이터 추가 완료 - ', roomId);
            res.json(roomId);
          })
          .catch(err => {
            console.log('error - ', err);
            res.json(err);
          });
        // 자리가 있는 방이 있는 경우
      } else {
        // 남는 방에 랜덤으로 들어간다.
        const matchedRoom = rows[Math.floor(Math.random() * count)];
        console.log(matchedRoom.joined_count);
        res.json(matchedRoom.id);
      }
    })
    .catch(err => {
      console.log('문제가 발생했습니다. - ', err);
      res.json(err);
    });
});

// 방에 있는 사용자들의 정보 보내주기
router.get('/:room/users', async (req, res) => {
  // 해당 방에 들어가있는 사용자들 검색
  await User.findAll({
    attributes: ['nickname', 'gender', 'image', 'tag', 'level', 'mobum_score'],
    where: { roomId: req.params.room },
  })
    .then(users => {
      res.send({ users });
    })
    .catch(err => {
      res.status(500).send({ err });
    });
});

// 클라이언트가 특정 방에 들어갔음을 확인
router.post('/:room', (req, res) => {
  try {
    res.send({
      userInfo: {
        id: req.user.id,
        nickname: req.user.nickname,
        gender: req.user.gender,
        image: req.user.image,
        tag: req.user.tag,
        mobumScore: req.user.mobumScore,
      },
    });
  } catch (err) {
    res.status(500).send({ err });
  }
});

module.exports = router;
