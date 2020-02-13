//url - '/api/aku'
const route = require('express').Router();
const jsForBack = require('../back/jsForBack.js');
const akuService = require('../service/akuService.js');

/* ===== aku ===== */

route.post('/check', function(req, res){
    akuService.checkUserCount(req.body.type, req.body.data).then(value => res.json(value));
});

module.exports = route;