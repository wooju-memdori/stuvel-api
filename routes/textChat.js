const express = require('express');
const Follow = require('../models/Follow');
const User = require('../models/User');
const { success, failed } = require('../common/response');
const { sequelize } = require('../models');

const router = express.Router();

// 방 생성
router.post('/rooms', async (req, res) => {
  // text_chat_room 생성
  // text_chat_room_user(참여자) 생성: 로그인유저, 파라미터로 받은 유저
});

// 방 목록 조회
router.get('/rooms', async (req, res) => {
  // text_chat_room 조회: text_chat_room_user와 조인해서 로그인 유저가 참여하고 있는 방 목록 가져옴
});

// 메시지 생성
router.post('/messages', async (req, res) => {
  // text_chat_message 생성
});

// 메시지 목록 조회
router.get('/messages', async (req, res) => {
  // text_chat_message 목록 조회 where text_chat_room_id = {}
});

module.exports = router;
