//url - '/cari'
const route = require('express').Router();
const jsForBack = require('./jsForBack.js');
const cariService = require('../service/cariService.js');

route.get('/search', function (req, res) {
    let rawCariString = req.query.search.split(' ');
    let wordOnly = jsForBack.getWordOnly(rawCariString);
    let hashOnly = jsForBack.getHashOnly(rawCariString);
    cariService.getSearch(wordOnly, hashOnly)
        .then(([uResults, pResults, tResults, yResults, phResults, thResults, yhResults]) => {
            console.log(phResults);
            console.log(thResults);
            console.log(yhResults);
            let hResults = phResults.concat(thResults);
            hResults = hResults.concat(yhResults);

            res.render('./jc/cari-result', {
                search_string: req.query.search,
                user: uResults,
                penobrol: pResults[0],
                tandya: tResults[0],
                youtublog: yResults[0],
                hashtag: hResults[0],
                u_id: req.session.u_id,
                id2: req.session.id2 ? req.session.id2 : 0
        })})
});

route.get('/', function (req, res) {
    //사용자에게 처음으로 보여지는 부분
    //각 테마에서 점수기준으로 상위 15개, 날짜기분으로 최근 15개를 골라 무작위로 5개를 고른후 합친 결과를 보여줌
    //그 이후, 스크롤이 바닥에 닿으면 random으로 각 테마에서 4개씩 최대 12개를 load해줌
    cariService.getCariArticle()
        .then(([cariPenobrol, cariTandya, cariYoutublog]) => {
            let result = cariPenobrol[0].concat(cariTandya[0]);
            result = result.concat(cariYoutublog[0]);
            jsForBack.shuffle(result);
            res.render('./jc/cari', {
                list: result,
                id2: req.session.id2 ? req.session.id2 : 0
            })
        });
});

module.exports = route;