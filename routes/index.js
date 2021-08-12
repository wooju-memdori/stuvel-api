const express = require('express');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

router.get('/', isLoggedIn, async (req, res, next) => {
  return res.send({ message: `${req.user.nickname}, 안녕?` });
});

module.exports = router;
