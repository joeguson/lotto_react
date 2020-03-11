//url - '/api/samusil'
const route = require('express').Router();
const jsForBack = require('../back/jsForBack.js');
const samusilService = require('../service/samusilService.js');
/* ===== samusil ===== */

route.get('/', function (req, res) {
    samusilService.getSamusilInfo()
        .then(([users, penobrol, tandya, youtublog, comment, answer]) => res.json({
            "users": users[0].users,
            "penobrol" : penobrol[0].penobrol,
            "tandya" : tandya[0].tandya,
            "youtublog" : youtublog[0].youtublog,
            "comment" : comment[0].pcom,
            "answer" : answer[0].tans
        }));

});

module.exports = route;