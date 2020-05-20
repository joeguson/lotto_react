//url - '/api/cari'
const route = require('express').Router();
const jsForBack = require('../back/jsForBack.js');
const cariService = require('../service/cariService.js');

/* ===== cari ===== */

route.get('/load', function(req, res){
    cariService.getRandArticle()
        .then(([randPenobrol, randTandya, randYoutublog]) => {
            let result = randPenobrol.concat(randTandya);
            result = result.concat(randYoutublog);
            jsForBack.shuffle(result);
            let responseData = result;
            res.json(responseData);
        });
});

module.exports = route;