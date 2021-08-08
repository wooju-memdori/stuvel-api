const express = require('express');
const { v4: uuidV4 } = require('uuid');

const router = express.Router();

// 매칭(기존 방에서 자리를 찾고 없으면 방 새로 생성)
router.get('/', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin); // 추가
  res.json(uuidV4());
});

// 방 정보 보여주기.. 참여자가 누군지.. 등등
router.get('/:room', (req, res) => {
  // res.render('room', { roomId: req.params.room });
});

module.exports = router;
