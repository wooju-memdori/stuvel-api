const express = require('express');
const Follow = require('../models/Follow');
const User = require('../models/User');
const { success, failed } = require('../common/response');

const router = express.Router();

router.get('/followers', async (req, res) => {
  Follow.findAll({
    include: [
      {
        model: User,
        as: 'followers',
        attributes: ['id', 'nickname', 'image', 'roomId'],
      },
    ],
    where: { targetId: req.user.dataValues.id },
  })
    .then(result => {
      const response = result.map(item => item.followers);
      res.send(success(response));
    })
    .catch(err => {
      console.log(failed(err));
      res.send(err);
    });
});

router.get('/followings', async (req, res) => {
  Follow.findAll({
    include: [
      {
        model: User,
        as: 'followings',
        attributes: ['id', 'email', 'nickname', 'image', 'roomId'],
      },
    ],
    where: { subjectId: req.user.dataValues.id },
  })
    .then(result => {
      const response = result.map(item => item.followings);
      res.send(success(response));
    })
    .catch(err => {
      res.send(failed(err));
    });
});

router.post('/follow/:id', async (req, res) => {
  Follow.create({
    subjectId: req.user.dataValues.id,
    targetId: req.params.id,
  })
    .then(result => {
      res.send(success(result));
    })
    .catch(err => {
      console.log(err);
      res.send(failed(err));
    });
});

router.delete('/follow/:id', async (req, res) => {
  Follow.destroy({
    where: {
      subjectId: req.user.dataValues.id,
      targetId: req.params.id,
    },
  })
    .then(result => {
      res.send(success(req.params.id));
    })
    .catch(err => {
      console.log(err);
      res.send(failed(err));
    });
});

module.exports = router;
