const express = require('express');
const { v4: uuidV4 } = require('uuid');

const router = express.Router();

// 매칭(기존 방에서 자리를 찾고 없으면 방 새로 생성)
router.get('/', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin); // 추가
  console.log(req.headers.origin);
  console.log('안찍히나?/');
  res.json(uuidV4());
});

// 특정 방 들어가기
router.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room });
});

module.exports = router;
