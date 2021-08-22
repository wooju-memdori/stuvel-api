const express = require('express');
const Follow = require('../models/Follow');
const User = require('../models/User');

const router = express.Router();

router.get('/followers', async (req, res) => {
  Follow.findAll({
    include: [
      {
        model: User,
        as: 'followers',
        attributes: ['id', 'email'],
      },
    ],
    where: { targetId: req.user.id },
  })
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
      res.send(err);
    });
});

router.get('/followings', async (req, res) => {
  Follow.findAll({
    include: [
      {
        model: User,
        as: 'following',
        attributes: ['id', 'email'],
      },
    ],
    where: { targetId: req.user.id },
  })
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
      res.send(err);
    });
});

router.post('/follow/:id', async (req, res) => {
  Follow.create({
    subjectId: req.user.dataValues.id,
    targetId: req.params.id,
  })
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
      res.send(err);
    });
});

router.delete('/follow/:id', async (req, res) => {
  Follow.delete({
    where: {
      subjectId: req.user.dataValues.id,
      targetId: req.params.id,
    },
  }).catch(err => {
    console.log(err);
    res.send(err);
  });
});

module.exports = router;
