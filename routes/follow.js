const express = require('express');
const { v4: uuidV4 } = require('uuid');
const { Op } = require('sequelize');
const Follow = require('../models/Follow');

const router = express.Router();

// 매칭(기존 방에서 자리를 찾고 없으면 방 새로 생성)
router.get('/followee', async (req, res) => {
  console.log(req.user);
});

module.exports = router;
