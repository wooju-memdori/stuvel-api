const express = require('express');
const Follow = require('../models/Follow');
const User = require('../models/User');
const { success, failed } = require('../common/response');
const { sequelize } = require('../models');

const router = express.Router();

router.get('/followers', async (req, res) => {
  sequelize
    .query(
      `
      select
        u.nickname,
        u.image,
        u.room_id,
        if(f2.subject_id is null, false, true) as following
      from follow f
        inner join user u on u.id = f.subject_id
        left outer join follow f2 on f.target_id = f2.subject_id and f2.target_id = f.subject_id
      where f.target_id = ${req.user.dataValues.id};`,
      { type: sequelize.QueryTypes.SELECT },
    )
    .then(result => {
      const parsedResult = result.map(item => ({
        ...item,
        following: Boolean(item.following),
      }));
      res.send(success(parsedResult));
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
