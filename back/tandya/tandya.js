var parser = require('../../db/parser.js');
var jsForBack = require('../../back/jsForBack.js');
var tandyaDao = require('../../db/b-dao/tandyaDao');

/************FOR TANDYA************/
exports.getTandya = function (req, res) {
    async function getOrderedT() {
        var byDate = (await tandyaDao.tandyaByDate()).map(parser.parseFrontTandya);
        var byScore = (await tandyaDao.tandyaByScore()).map(parser.parseFrontTandya);
        for(const t of byDate){
            t.hashtags = (await tandyaDao.tandyaHashtagById(t.id)).map(parser.parseHashtagT);
            t.answerCount = (await tandyaDao.tandyaAnsCountById(t.id))[0].count;
        }
        for(const t of byScore){
            t.answerCount = (await tandyaDao.tandyaAnsCountById(t.id))[0].count;
            t.hashtags = (await tandyaDao.tandyaHashtagById(t.id)).map(parser.parseHashtagT);
        }
        res.render('./jt/t', {
            dateTopics: byDate,
            scoreTopics: byScore,
            id2: req.session.id2
        });
    }
    getOrderedT();
};

exports.getViewTandya = function (req, res) {
    var id = req.params.tandya_no;
    var checkId = /^[0-9]+$/;
    if (checkId.test(id)) {
        async function getT() {
            var idCheck = await tandyaDao.tandyaById(id);
            if(idCheck[0]){
                await tandyaDao.updateTandyaView(id);
                await tandyaDao.updateTandyaScore(id);
                var tandya = parser.parseTandya((await tandyaDao.tandyaById(id))[0]);
                tandya.answers = (await tandyaDao.tandyaAnsByScore(id)).map(parser.parseAnswer);
                tandya.likes = (await tandyaDao.tandyaLikeById(id)).map(parser.parseTLike);
                tandya.hashtags = (await tandyaDao.tandyaHashtagById(id)).map(parser.parseHashtagT);
                for(const a of tandya.answers) {
                    a.comments = (await tandyaDao.tandyaAnsComByTaId(a.id)).map(parser.parseAComment);
                    a.likes = (await tandyaDao.tandyaAnsLikeById(a.id)).map(parser.parseALike);
                }
                res.render('./jt/t-view', {
                    topic: tandya,
                    u_id: req.session.u_id,
                    id2: req.session.id2,
                });
            }
            else{
                res.redirect('/tandya/');
            }
        }
        getT();
    }
    else {
        res.redirect('/tandya/');
    }
};

exports.getAddTandya = function (req, res) {
    if (req.session.id2) {
        res.render('./jt/t-add', {id2: req.session.id2});
    } else {
        res.redirect('/tandya/');
    }
};

exports.postAddTandya = function (req, res) {
    var author = req.session.id2;
    var content = req.body.content;
    var question = req.body.question;
    var rawhashtags = req.body.hashtag;
    var thumbnail = req.body.thumbnail;
    var public = req.body.public;
    var finalhashtag = jsForBack.finalHashtagMaker(rawhashtags);

    async function postTandya() {
        var tandya = await tandyaDao.insertTandya(author, question, content, public, thumbnail);
        for (var i = 0; i < finalhashtag.length; i++) {
            await tandyaDao.insertTandyaHash(tandya.insertId, finalhashtag[i]);
        }
        res.json({
            "id" : tandya.insertId
        });
    }
    postTandya();
};

exports.postAddAnswer = function (req, res) {
    var author = req.session.id2;
    var answer = req.body.answer;
    var t_id = req.params.tandya_no;

    async function postTandyaAnswer(){
        await tandyaDao.insertTandyaAns(author, answer, t_id);
        await tandyaDao.updateTandyaScore(t_id);
        res.redirect('/tandya/view/' + t_id);
    }
    postTandyaAnswer();
};

exports.postAddAcomment = function (req, res) {
    var author = req.session.id2;
    var content = req.body.acommentContent;
    var t_id = req.params.t_id;
    var ta_id = req.params.ta_id;
    async function postTandyaAnsCom(){
        await tandyaDao.updateTandyaAnsScore(ta_id, t_id);
        var postCom = await tandyaDao.insertTandyaAnsCom(author, content, ta_id);
        var postedCom = await tandyaDao.tandyaAnsComById(postCom.insertId);
        res.json({
            "acomment_id": postedCom[0].id,
            "acomment_author": postedCom[0].u_id,
            "acomment_content": postedCom[0].content,
            "acomment_date": postedCom[0].date
        });
    }
    postTandyaAnsCom();
};

exports.likesTandya = function (req, res) {
    var t_id = parseInt(req.body.t_id);
    var clickVal = parseInt(req.body.clickVal);
    async function likeTandyaArticle(){
        var buttonVal = 0;
        if(clickVal == 1){
            await tandyaDao.deleteTandyaLike(t_id, req.session.id2)
            buttonVal = 0;
        }
        else{
            await tandyaDao.insertTandyaLike(t_id, req.session.id2)
            buttonVal = 1;
        }
        await tandyaDao.updateTandyaScore(t_id);
        var ajaxResult = await tandyaDao.tandyaLikeCount(t_id);
        res.json({"t_like": ajaxResult[0].tlikeCount, "button": buttonVal});
    }
    likeTandyaArticle();
};

exports.likesAnswer = function (req, res) {
    var t_id = parseInt(req.body.t_id);
    var ta_id = parseInt(req.body.ta_id);
    var clickVal = parseInt(req.body.clickVal);
    async function likeTandyaAnswer(){
        var buttonVal = 0;
        if(clickVal == 1){
            await tandyaDao.deleteTandyaAnsLike(ta_id, req.session.id2)
            buttonVal = 0;
        }
        else{
            await tandyaDao.insertTandyaAnsLike(ta_id, req.session.id2)
            buttonVal = 1;
        }
        await tandyaDao.updateTandyaAnsScore(ta_id, t_id);
        var ajaxResult = await tandyaDao.tandyaAnsLikeCount(ta_id);
        res.json({"ta_like": ajaxResult[0].taLikeCount, "button": buttonVal});
    }
    likeTandyaAnswer();
};

exports.warningTandya = function (req, res) {
    async function warnTandya(warnedItem, warnedId){
        const fs = {
            t: [tandyaDao.tandyaWarnById, tandyaDao.insertTandyaWarn],
            ta: [tandyaDao.tandyaAnsWarnById, tandyaDao.insertTandyaAnsWarn],
            tac: [tandyaDao.tandyaAnsComWarnById, tandyaDao.insertTandyaAnsComWarn]
        };
        // 공통 로직
        const checking = await fs[warnedItem](warnedId, req.session.id2);
        if(checking.length) res.json({"result": 0});
        else {
            await fs[warnedItem](req.session.id2, warnedId);
            res.json({"result": 1});
        }
    }
    warnTandya(req.body.warnedItem, req.body.warnedId);
};

exports.getEditTandya = function (req, res) {
    var t_id = req.params.tandya_no;

    async function getEditTandya(){
        var tandya = parser.parseTandya((await tandyaDao.tandyaById(t_id))[0]);
        tandya.hashtags = (await tandyaDao.tandyaHashtagById(t_id)).map(parser.parseHashtagT);
        if(req.session.id2 == tandya.author){
            res.render('./jt/t-edit', {u_id: req.session.id2, edit_content: tandya});
        }
        else{
            res.redirect('/tandya/view/' + t_id);
        }
    }
    getEditTandya();
};

exports.postEditTandya = function (req, res) {
    var question = req.body.question;
    var content = req.body.content;
    var thumbnail = req.body.thumbnail;
    var public = req.body.public;
    var t_id = req.params.tandya_no;
    var rawhashtags = req.body.hashtag;
    var finalHashtag = jsForBack.finalHashtagMaker(rawhashtags);

    async function postEditTandya() {
        await tandyaDao.deleteTandyaHash(t_id);
        await tandyaDao.updateTandyaDate(t_id);
        await tandyaDao.updateTandya(question, content, public, thumbnail, t_id);
        await Promise.all(
            Array.from({length: finalHashtag.length}, (x,i) => i)
            .map(it => finalHashtag[it])
            .map(it => tandyaDao.insertTandyaHash(t_id, it))
        );
        res.json({
            "id" : t_id
        });
    }
    postEditTandya();
};

exports.getEditTanswer = function (req, res) {
    var ta_id = req.params.tanswer_no;
    var t_id = req.params.tandya_no;

    async function getEditTandyaAns(){
        var tandya = (await tandyaDao.tandyaById(t_id)).map(parser.parseFrontTandya);
        tandya.hashtags = (await tandyaDao.tandyaHashtagById(t_id)).map(parser.parseHashtagT);
        var tanswer = await tandyaDao.tandyaAnsById(ta_id);
        if(u_id == pcomment[0].author){
            res.render('./jt/ta-edit', {
                u_id: 'y',
                topic: tandya,
                edit_content:tanswer[0],
            });
        }
        else{
            res.redirect('/tandya/view/' + t_id);
        }
    }
    getEditTandyaAns();
};

exports.postEditTanswer = function (req, res) {
    var content = req.body.answer;
    var t_id = req.params.tandya_no;
    var ta_id = req.params.tanswer_no;

    async function editTanswer(){
        await tandyaDao.updateTandyaAns(content, ta_id, t_id);
        res.redirect('/tandya/' + t_id);
    }
    editTanswer();
};

exports.postDeleteTandya = function(req, res){
    var deleteId = req.body.deleteId;

    async function deleteTandya(){
        var checkAuthor = await tandyaDao.tandyaById(deleteId);
        if(checkAuthor[0].author == req.session.id2){
            await tandyaDao.deleteTandya(deleteId);
            res.json({"result":"deleted"});
        }
        else{
            res.redirect('/tandya');
        }
    }
    deleteTandya();
}

exports.postDeleteTanswer = function(req, res){
    var deleteId = req.body.deleteId;
    var t_id = req.body.tandyaId

    async function deleteTandyaAns(){
        var checkAuthor = await tandyaDao.tandyaAnsById(deleteId);
        if(checkAuthor[0].author == req.session.id2){
            await tandyaDao.deleteTandyaAns(deleteId);
            res.json({"result":"deleted"});
        }
        else{
            res.redirect('/tandya/view/'+ t_id);
        }
    }
    deleteTandyaAns();
}

exports.postDeleteTacomment = function(req, res){
    var deleteId = req.body.deleteId;
    var t_id = req.body.tandyaId
    async function deleteTandyaAnsCom(){
        var checkAuthor = await tandyaDao.tandyaAnsComById(deleteId);
        if(checkAuthor[0].author == req.session.id2){
            await tandyaDao.deleteTandyaAnsCom(deleteId);
            res.json({"result":"deleted"});
        }
        else{
            res.redirect('/tandya/view/'+ t_id);
        }
    }
    deleteTandyaAnsCom();
}
