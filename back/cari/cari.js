var parser = require('../../db/parser.js');
var jsForBack = require('../jsForBack.js');
var penobrolDao = require('../../db/b-dao/penobrolDao');
var tandyaDao = require('../../db/b-dao/tandyaDao');

function shuffle(list) {
    var j, x, i;
    for (i = list.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = list[i];
        list[i] = list[j];
        list[j] = x;
    }
}

exports.getSearch = function (req, res) {
    var rawCariString = req.query.search.split(' ');
    var wordOnly = jsForBack.getWordOnly(rawCariString);
    var hashOnly = jsForBack.getHashOnly(rawCariString);

    //var usersql = 'select * from users AS result WHERE MATCH(u_id) AGAINST(?)';
    async function getSearchResult() {
        var pResults = (await penobrolDao.penobrolSearch(wordOnly)).map(parser.parseFrontPenobrol);
        var tResults = (await tandyaDao.tandyaSearch(wordOnly)).map(parser.parseFrontTandya);;
        var phResults = [];
        var thResults = [];
        var hResultArr = [];
        for(var h of hashOnly){
            phResults = ((await penobrolDao.penobrolSearchByHash('%'+h+'%')).reduce((acc, cur) => acc.concat(cur), [])).map(parser.parseFrontPenobrol);
            thResults = ((await tandyaDao.tandyaSearchByHash('%'+h+'%')).reduce((acc, cur) => acc.concat(cur), [])).map(parser.parseFrontTandya);
        }
        for (const p of pResults){
            p.hashtags = (await penobrolDao.penobrolHashtagById(p.id)).map(parser.parseHashtagP);
            p.commentCount = (await penobrolDao.penobrolComCountById(p.id))[0].count;
            p.likeCount = (await penobrolDao.penobrolLikeCount(p.id))[0].plikeCount
        }
        for (const t of tResults){
            t.hashtags = (await tandyaDao.tandyaHashtagById(t.id)).map(parser.parseHashtagT);
            t.answerCount = (await tandyaDao.tandyaAnsCountById(t.id))[0].count;
            t.likeCount = (await tandyaDao.tandyaLikeCount(t.id))[0].tlikeCount
        }
        for (const ph of phResults){
            ph.hashtags = (await penobrolDao.penobrolHashtagById(ph.id)).map(parser.parseHashtagP);
            ph.commentCount = (await penobrolDao.penobrolComCountById(ph.id))[0].count;
            ph.likeCount = (await penobrolDao.penobrolLikeCount(ph.id))[0].plikeCount
        }
        for (const th of thResults){
            th.hashtags = (await tandyaDao.tandyaHashtagById(th.id)).map(parser.parseHashtagT);
            th.answerCount = (await tandyaDao.tandyaAnsCountById(th.id))[0].count;
            th.likeCount = (await tandyaDao.tandyaLikeCount(th.id))[0].tlikeCount;
        }
        var hResults = phResults.concat(thResults);
        console.log(hResults);
        res.render('./jc/cari-result', {
            search_string: req.query.search,
            penobrol: pResults,
            tandya: tResults,
            hashtag: hResults,
            u_id: req.session.u_id,
            id2 : req.session.id2
        });
    }
    getSearchResult();
};

exports.getCari = function (req, res) {
    async function getRandomPandT() {
        (await penobrolDao.penobrolByDate()).map(parser.parseFrontPenobrol)
        var pResults = (await penobrolDao.penobrolByRand()).map(parser.parseFrontPenobrol);
        var tResults = (await tandyaDao.tandyaByRand()).map(parser.parseFrontTandya);
        for (const p of pResults){
            p.hashtags = (await penobrolDao.penobrolHashtagById(p.id)).map(parser.parseHashtagP);
            p.commentCount = (await penobrolDao.penobrolComCountById(p.id))[0].count;
            p.likeCount = (await penobrolDao.penobrolLikeCount(p.id))[0].plikeCount
        }
        for (const t of tResults){
            t.hashtags = (await tandyaDao.tandyaHashtagById(t.id)).map(parser.parseHashtagT);
            t.answerCount = (await tandyaDao.tandyaAnsCountById(t.id))[0].count;
            t.likeCount = (await tandyaDao.tandyaLikeCount(t.id))[0].tlikeCount
        };
        var result = pResults.concat(tResults);
        shuffle(result);
        // u_id 가 없으면 어차피 undefined 로 들어가므로 통합 가능
        if(req.url == '/cari/load'){
            var responseData = {'result': 'ok', 'data': result};
            res.json(responseData);
        }
        else{
            res.render('./jc/cari', {
                list: result,
                u_id: req.session.u_id
            });
        }
    }
    getRandomPandT();
};
