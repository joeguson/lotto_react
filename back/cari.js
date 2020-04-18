//url - '/cari'
const route = require('express').Router();
const jsForBack = require('./jsForBack.js');
const cariService = require('../service/cariService.js');

route.get('/search', function (req, res) {
    let rawCariString = req.query.search.split(' ');
    let wordOnly = jsForBack.getWordOnly(rawCariString);
    let hashOnly = jsForBack.getHashOnly(rawCariString);
    cariService.getSearch(wordOnly, hashOnly)
        .then(([uResults, pResults, tResults, phResults, thResults]) => {
            let hResults = phResults.concat(thResults);
            res.render('./jc/cari-result', {
                search_string: req.query.search,
                user: uResults,
                penobrol: pResults,
                tandya: tResults,
                hashtag: hResults,
                u_id: req.session.u_id,
                id2 : req.session.id2
        })})
});

route.get('/', function (req, res) {
    cariService.getRandArticle()
        .then(([randPenobrol, randTandya, randYoutublog]) => {
            let result = randPenobrol.concat(randTandya);
            result = result.concat(randYoutublog);
            jsForBack.shuffle(result);
            res.render('./jc/cari', {
                list: result,
                u_id: req.session.u_id
            })
        });
});

module.exports = route;