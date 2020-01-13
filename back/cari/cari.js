var conn = require('../../b');
var pool = require('../../b');
var dbcon = require('../../db/dbconnection');
var parser = require('../../db/parser.js');
var jsForBack = require('../jsForBack.js');

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
    //search string 정리의 시간
    var rawCariString = req.query.search.split(' ');
    var wordOnly = jsForBack.getWordOnly(rawCariString);
    var hashOnly = jsForBack.getHashOnly(rawCariString);
    var penobrolsql = 'SELECT * FROM penobrol AS result WHERE MATCH(title, content) AGAINST(?)';
    var tandyasql = 'SELECT * FROM tandya AS result WHERE MATCH(question, content) AGAINST(?)';
    var phashtagsql = 'select * from penobrol where id in (select distinct p_id from penobrol_hashtag where hash like ?)';
    var thashtagsql = 'select * from tandya where id in (select distinct t_id from tandya_hashtag where hash like ?)';
    var getHashtagP = 'select * from penobrol_hashtag where p_id = ?';
    var getHashtagT = 'select * from tandya_hashtag where t_id = ?';
    var usersql = 'select * from users AS result WHERE MATCH(u_id) AGAINST(?)';
    async function getSearchResult() {
        var pResults = await dbcon.twoArg(penobrolsql, wordOnly);
        var tResults = await dbcon.twoArg(tandyasql, wordOnly);
        var phResults = [];
        var thResults = [];
        var hResultArr = [];
        for(var h of hashOnly){
            phResults = (await dbcon.twoArg(phashtagsql, '%'+h+'%')).reduce((acc, cur) => acc.concat(cur), []);
            thResults = (await dbcon.twoArg(thashtagsql, '%'+h+'%')).reduce((acc, cur) => acc.concat(cur), []);
        }
        for (const p of pResults)
            p.hashtags = (await dbcon.twoArg(getHashtagP, p.id)).map(parser.parseHashtagP);
        pResults = pResults.map(parser.parseFrontPenobrol);
        for (const t of tResults)
            t.hashtags = (await dbcon.twoArg(getHashtagT, t.id)).map(parser.parseHashtagT);
        tResults = tResults.map(parser.parseFrontTandya);
        for (const ph of phResults){
            ph.hashtags = (await dbcon.twoArg(getHashtagP, ph.id)).map(parser.parseHashtagP);
        }
        phResults = phResults.map(parser.parseFrontPenobrol);
        for (const th of thResults)
            th.hashtags = (await dbcon.twoArg(getHashtagT, th.id)).map(parser.parseHashtagT);
        thResults = thResults.map(parser.parseFrontTandya);

        var hResult = phResults.concat(thResults);
        res.render('./jc/cari-result', {
            penobrol: pResults,
            tandya: tResults,
            hashtag: hResult,
            u_id: req.session.u_id,
            id2 : req.session.id2
        });
        }
    getSearchResult();
};


exports.getCari = function (req, res) {
    var getRandomPenobrol = 'select p.*, u.u_id from penobrol p join users as u on p.author = u.id order by rand () limit 3';
    var getRandomTandya = 'select t.*, u.u_id from tandya t join users as u on t.author = u.id order by rand () limit 3';
    var getHashtagP = 'select * from penobrol_hashtag where p_id = ?';
    var getHashtagT = 'select * from tandya_hashtag where t_id = ?';
    var pResults = [];
    var tResults = [];

    async function getRandomPandT() {
        pResults = await dbcon.oneArg(getRandomPenobrol);
        tResults = await dbcon.oneArg(getRandomTandya);
        for (const p of pResults)
            p.hashtags = (await dbcon.twoArg(getHashtagP, p.id)).map(parser.parseHashtagP);
        pResults = pResults.map(parser.parseFrontPenobrol);

        for (const t of tResults)
            t.hashtags = (await dbcon.twoArg(getHashtagT, t.id)).map(parser.parseHashtagT);
        tResults = tResults.map(parser.parseFrontTandya);
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

// //    var todayDate = new Date();
// //    var todayDay = todayDate.getDate();
// //    if(parseInt(req.cookies.visitDate) !== todayDay){
// //        todayCount++;
// //    }
// //    res.cookie('visitDate', todayDay, {maxAge: 86400000, httpOnly: true });
// //    var ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
//
// //    var sql3 = '';
// //    var sql4 = '';
// var newpsql = '';
// var newtsql = '';
//
// var searchStringSql = '';
// var ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
// if (req.session.u_id) {
//     searchStringSql = 'INSERT INTO search_string (u_id, search_string, ipAddress) VALUES (?, ?, INET_ATON(?))';
//     conn.query(searchStringSql, [req.session.u_id, cari, ipAddress], function (err, searchStringResult, field) {
//         if (err) {
//             console.log(err);
//         }
//     });
// } else {
//     searchStringSql = 'INSERT INTO search_string (search_string, ipAddress) VALUES (?, INET_ATON(?))';
//     conn.query(searchStringSql, [cari, ipAddress], function (err, searchStringResult, field) {
//         if (err) {
//             console.log(err);
//         }
//     });
// }
