//url - '/api/aku'
const route = require('express').Router();
const akuService = require('../service/akuService.js');

/* ===== aku ===== */

route.post('/check', function (req, res) {
    akuService.checkUserDataExists(req.body.type, req.body.data)
        .then(value => res.json(value));
});

route.get('/follow/:target', function (req, res) {
    const target = req.params.target;
    akuService.isFollowing(target).then(result =>
        res.json({
            "status": result
        })
    );
});

route.post('/follow', function (req, res) {
    const me = req.session.id2;
    const target = req.body.target;
    const status = req.body.status;

    const method = status ? akuService.followUser : akuService.unfollowUser;

    method(me, target).then(result => {
        res.json({
            "success": result
        });
    });
});

module.exports = route;