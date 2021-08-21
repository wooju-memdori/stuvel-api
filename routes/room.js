const express = require('express');
const { v4: uuidV4 } = require('uuid');
const { Op } = require('sequelize');
const Room = require('../models/Room');

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
          joined_count: 1,
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

// 특정 방 들어가기
router.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room });
});

module.exports = router;
