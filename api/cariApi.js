//url - '/api/cari'
const route = require('express').Router();
const jsForBack = require('../back/jsForBack.js');
const cariService = require('../service/cariService.js');

/* ===== aku ===== */

route.get('/', function(req, res){
    cariService.getRandArticle()
        .then(([randPenobrol, randTandya]) => {
            let result = randPenobrol.concat(randTandya);
            jsForBack.shuffle(result);
            let responseData = {'result': 'ok', 'data': result};
            res.json(responseData);
        });
});

module.exports = route;