const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');


// 회원 가입 (CREATE)
router.post('/signup', (req, res) => {
    let user = require('./models/User');
    user.email = req.body.email;
    user.nickname = req.body.nickname;
    user.gender = req.body.gender;
    user.password = req.body.password;
    user.image = req.body.image;
    user.tag = req.body.tag;

    user.save(function (err) {
        if (err) {
            console.error(err);
            res.json({ message: '생성 실패' });
            return;
        }
        res.json({ message: '생성 완료!' });
    });

});


// 회원 조회 (READ)
router.get('/user/:nickname', (req, res) => {

    User.findOne({ nickname: req.params.nickname }, function (err, user) {
        if (err) return res.status(500).json({ error: err });
        if (!user) return res.status(404).json({ error: '해당 닉네임을 가진 유저가 존재하지 않습니다.' });
        res.json(user);
    })

});



// 회원 삭제 (DELETE)
router.delete('/delete', (req, res) => {

    User.remove({ email: req.body.email }, function (err, output) {
        if (err) return res.status(500).json({ error: "Database Failure!" });

        res.json({ message: "삭제 완료" });

        res.status(204).end();
    })
});



module.exports = router;