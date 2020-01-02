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
        res.render('./jc/cari', {
            list: result,
            u_id: req.session.u_id
        });
    }
    getRandomPandT();
};

exports.getSearch = function (req, res) {
    //search string 정리의 시간
    var rawCariString = req.query.search.split(' ');
    console.log(rawCariString);
    var getWords = jsForBack.extractWords(rawCariString);
    var getHashes = jsForBack.extractHash(rawCariString);
    var hsresult = [];
    var hsforpt = [];
    var cari_check = searchStringLengthChecker(cari);
    var hashtagonly = [];
    var hashtagonly2 = '';
    var stringonly = [];
    var stringonly2 = '';
    var penobrolsql = 'SELECT * FROM penobrol AS result WHERE MATCH(title, content) AGAINST(?)';
    var tandyasql = 'SELECT * FROM tandya AS result WHERE MATCH(question, content) AGAINST(?)';
    var usersql = 'select * from users AS result WHERE MATCH(u_id) AGAINST(?)';
    var hashtagsql = '';
    var phtsql = '';
    var thtsql = '';
    for (var q = 0; q < cari_check.length; q++) {
        if (cari_check[q].indexOf('#') != -1) {
            hashtagonly.push(cari_check[q].substring(1));
            hashtagonly2 = hashtagonly2 + cari_check[q].substring(1) + ' ';
        } else {
            stringonly.push(cari_check[q]);
            stringonly2 = stringonly2 + cari_check[q] + ' ';
        }
    }
    hashtagonly2 = hashtagonly2.trim();
    stringonly2 = stringonly2.trim();

};

exports.getLoad = function (req, res) {
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
        pResults = pResults.map(parser.parsePenobrol);

        for (const t of tResults)
            t.hashtags = (await dbcon.twoArg(getHashtagT, t.id)).map(parser.parseHashtagT);
        tResults = tResults.map(parser.parseTandya);

        var result = pResults.concat(tResults);
        shuffle(result);
        var responseData = {'result': 'ok', 'data': result};
        res.json(responseData);
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
