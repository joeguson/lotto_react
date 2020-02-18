//url - '/api/aku'
const route = require('express').Router();
const jsForBack = require('../back/jsForBack.js');
const akuService = require('../service/akuService.js');

/* ===== aku ===== */

route.post('/check', function(req, res){
    akuService.checkUserCount(req.body.type, req.body.data).then(value => res.json(value));
});

route.post('/follow', function(req, res){
    console.log(req.body);
    console.log(req.body.status);
    console.log(req.body.id2);
    console.log(req.body.target);
    akuService.followUser(req.body.id2, req.body.target).then((result) => {console.log(result);});
});

module.exports = route;