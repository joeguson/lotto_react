var parser = require('../../db/parser.js');
var jsForBack = require('../../back/jsForBack.js');
var penobrolDao = require('../../db/b-dao/penobrolDao');

/************FOR PENOBROL************/
exports.getPenobrol = function (req, res) {
    async function getOrderedP() {
        var byDate = (await penobrolDao.penobrolByDate()).map(parser.parseFrontPenobrol);
        var byScore = (await penobrolDao.penobrolByScore()).map(parser.parseFrontPenobrol);
        for(const p of byDate)
            p.hashtags = (await penobrolDao.penobrolHashtagById(p.id)).map(parser.parseHashtagP);
        for(const p of byScore)
            p.hashtags = (await penobrolDao.penobrolHashtagById(p.id)).map(parser.parseHashtagP);
        res.render('./jp/p', {
            dateTopics: byDate,
            scoreTopics: byScore,
            id2: req.session.id2
        });
    }
    getOrderedP();
};

exports.getViewPenobrol = function (req, res) {
    var id = req.params.penobrol_no;
    var checkId = /^[0-9]+$/;
    if(checkId.test(id)){
        async function getP() {
            var maxCheck = await penobrolDao.penobrolMaxId();
            if(maxCheck[0].max < id){
                res.redirect('/penobrol/');
            }
            else{
                await penobrolDao.updatePenobrolView(id);
                await penobrolDao.updatePenobrolScore(id);
                var penobrol = parser.parsePenobrol((await penobrolDao.penobrolById(id))[0]);
                penobrol.comments = (await penobrolDao.penobrolComByScore(id)).map(parser.parseComment);
                penobrol.likes = (await penobrolDao.penobrolLikeById(id)).map(parser.parsePLike);
                penobrol.hashtags = (await penobrolDao.penobrolHashtagById(id)).map(parser.parseHashtagP);
                for (const c of penobrol.comments) {
                    c.comments = (await penobrolDao.penobrolComComByPcId(c.id)).map(parser.parseCComment);
                    c.likes = (await penobrolDao.penobrolComLikeById(c.id)).map(parser.parseCLike);
                }
                res.render('./jp/p-view', {
                    topic: penobrol,
                    u_id: req.session.u_id,
                    id2: req.session.id2
                });
            }
        }
        getP();
    }
    else{
        res.redirect('/penobrol/');
    }
};

exports.getAddPenobrol = function (req, res) {
    if (req.session.u_id) {
        res.render('./jp/p-add');
    } else {
        res.redirect('/penobrol/');
    }
};

exports.postAddPenobrol = function (req, res) {
    var author = req.session.id2;
    var content = req.body.content;
    var thumbnail = req.body.thumbnail;
    var title = req.body.title;
    var rawhashtags = req.body.hashtag;
    var public = req.body.public;
    var finalHashtag = jsForBack.finalHashtagMaker(rawhashtags);

    async function postPenobrol(){
        var penobrol = await penobrolDao.insertPenobrol(author, title, content, public, thumbnail);
        for (var i = 0; i < finalHashtag.length; i++) {
            await penobrolDao.insertPenobrolHash(penobrol.insertId, finalHashtag[i]);
        }
        res.json({
            "id" : penobrol.insertId
        });
    }
    postPenobrol();
};

exports.postAddComment = function (req, res) {
    var author = req.session.id2;
    var content = req.body.comment;
    var p_id = req.params.penobrol_no;

    async function postPenobrolComment(){
        var comment = await penobrolDao.insertPenobrolCom(author, content, p_id);
        await penobrolDao.updatePenobrolScore(p_id);
        res.redirect('/penobrol/' + p_id);
    }
    postPenobrolComment();
};

exports.postAddCcomment = function (req, res) {
    var author = req.session.id2;
    var content = req.body.ccommentContent;
    var p_id = req.params.p_id;
    var pc_id = req.params.pc_id;
    async function postPenobrolComCom(){
        await penobrolDao.updatePenobrolComScore(pc_id, p_id);
        var postCom = await penobrolDao.insertPenobrolComCom(author, content, pc_id);
        var postedCom = await penobrolDao.penobrolComComById(postCom.insertId);
        res.json({
            "ccomment_id": postedCom[0].id,
            "ccomment_author": postedCom[0].u_id,
            "ccomment_content": postedCom[0].content,
            "ccomment_date": postedCom[0].date
        });
    }
    postPenobrolComCom();
};

exports.likesPenobrol = function (req, res) {
    var p_id = parseInt(req.body.p_id);
    var clickVal = parseInt(req.body.clickVal);
    async function likePenobrolArticle(){
        var buttonVal = 0;
        if(clickVal == 1){
            await penobrolDao.deletePenobrolLike(p_id, req.session.id2)
            buttonVal = 0;
        }
        else{
            await penobrolDao.insertPenobrolLike(p_id, req.session.id2)
            buttonVal = 1;
        }
        await penobrolDao.updatePenobrolScore(p_id);
        var ajaxResult = await penobrolDao.penobrolLikeCount(p_id);
        res.json({"p_like": ajaxResult[0].plikeCount, "button": buttonVal});
    }
    likePenobrolArticle();
};

exports.likesComment = function (req, res) {
    var p_id = parseInt(req.body.p_id);
    var pc_id = parseInt(req.body.pc_id);
    var clickVal = parseInt(req.body.clickVal);
    async function likePenobrolComment(){
        var buttonVal = 0;
        if(clickVal == 1){
            await penobrolDao.deletePenobrolComLike(pc_id, req.session.id2)
            buttonVal = 0;
        }
        else{
            await penobrolDao.insertPenobrolComLike(pc_id, req.session.id2)
            buttonVal = 1;
        }
        await penobrolDao.updatePenobrolComScore(pc_id, p_id);
        var ajaxResult = await penobrolDao.penobrolComLikeCount(pc_id);
        res.json({"pc_like": ajaxResult[0].pcLikeCount, "button": buttonVal});
    }
    likePenobrolComment();
};

exports.warningPenobrol = function (req, res) {
    async function warnPenobrol(warnedItem, warnedId){
        var checking = '';
        switch(warnedItem){
            case 'p':
                checking = await penobrolDao.penobrolWarnById(warnedId, req.session.id2)
                break;
            case 'pc':
                checking = await penobrolDao.penobrolComWarnById(warnedId, req.session.id2)
                break;
            case 'pcc':
                checking = await penobrolDao.penobrolComComWarnById(warnedId, req.session.id2)
                break;
        }
        if(checking.length){
            res.json({"result": 0});
        }
        else{
            switch(warnedItem){
                case 'p':
                    await penobrolDao.insertPenobrolWarn(req.session.id2, warnedId)
                    break;
                case 'pc':
                    await penobrolDao.insertPenobrolComWarn(req.session.id2, warnedId)
                    break;
                case 'pcc':
                    await penobrolDao.insertPenobrolComComWarn(req.session.id2, warnedId)
                    break;
            }
            res.json({"result": 1});
        }
    }
    warnPenobrol(req.body.warnedItem, req.body.warnedId);
};

exports.getEditPenobrol = function (req, res) {
    var p_id = req.params.penobrol_no;

    async function getEditPenobrol(){
        var penobrol = parser.parsePenobrol((await penobrolDao.penobrolById(p_id))[0]);
        penobrol.hashtags = (await penobrolDao.penobrolHashtagById(p_id)).map(parser.parseHashtagP);
        if(req.session.id2 == penobrol.author){
            res.render('./jp/p-edit', {u_id: req.session.id2, edit_content: penobrol});
        }
        else{
            res.redirect('/penobrol/' + p_id);
        }
    }
    getEditPenobrol();
};

exports.postEditPenobrol = function (req, res) {
    var title = req.body.title;
    var content = req.body.content;
    var thumbnail = req.body.thumbnail;
    var public = req.body.public;
    var p_id = req.params.penobrol_no;
    var rawhashtags = req.body.hashtag;
    var finalHashtag = jsForBack.finalHashtagMaker(rawhashtags);

    async function postEditPenobrol() {
        await penobrolDao.deletePenobrolHash(p_id);
        await penobrolDao.updatePenobrolDate(p_id);
        await penobrolDao.updatePenobrol(title, content, public, thumbnail, p_id);
        for (var i = 0; i < finalHashtag.length; i++) {
            await penobrolDao.insertPenobrolHash(p_id, finalHashtag[i]);
        }
        res.json({
            "id" : p_id
        });
    }
    postEditPenobrol();
};

exports.getEditPcomment = function (req, res) {
    var pc_id = req.params.pcomment_no;
    var p_id = req.params.penobrol_no;

    async function getEditPenobrolCom(){
        var penobrol = (await penobrolDao.penobrolById(p_id)).map(parser.parseFrontPenobrol);
        penobrol.hashtags = (await penobrolDao.penobrolHashtagById(p_id)).map(parser.parseHashtagP);
        var pcomment = await penobrolDao.penobrolComById(pc_id);
        if(u_id == pcomment[0].author){
            res.render('./jp/pc-edit', {
                u_id: 'y',
                topic: penobrol,
                edit_content:pcomment[0],
            });
        }
        else{
            res.redirect('/penobrol/' + p_id);
        }
    }
    getEditPenobrolCom();
};

exports.postEditPcomment = function (req, res) {
    var content = req.body.comment;
    var p_id = req.params.penobrol_no;
    var pc_id = req.params.pcomment_no;

    async function editPcomment(){
        await penobrolDao.updatePenobrolCom(content, pc_id, p_id);
        res.redirect('/penobrol/' + p_id);
    }
    editPcomment();
};

exports.postDeletePenobrol = function(req, res){
    var deleteId = req.body.deleteId;

    async function deletePenobrol(){
        var checkAuthor = await penobrolDao.penobrolById(deleteId);
        if(checkAuthor[0].author == req.session.id2){
            await penobrolDao.deletePenobrol(deleteId);
            res.json({"result":"deleted"});
        }
        else{
            res.redirect('/penobrol');
        }
    }
    deletePenobrol();
}

exports.postDeletePcomment = function(req, res){
    var deleteId = req.body.deleteId;
    var p_id = req.body.penobrolId

    async function deletePenobrolCom(){
        var checkAuthor = await penobrolDao.penobrolComById(deleteId);
        if(checkAuthor[0].author == req.session.id2){
            await penobrolDao.deletePenobrolCom(deleteId);
            res.json({"result":"deleted"});
        }
        else{
            res.redirect('/penobrol/'+ p_id);
        }
    }
    deletePenobrolCom();
}

exports.postDeletePccomment = function(req, res){
    var deleteId = req.body.deleteId;
    var p_id = req.body.penobrolId;
    async function deletePenobrolComCom(){
        var checkAuthor = await penobrolDao.penobrolComComById(deleteId);
        if(checkAuthor[0].author == req.session.id2){
            await penobrolDao.deletePenobrolComCom(deleteId);
            res.json({"result":"deleted"});
        }
        else{
            res.redirect('/penobrol/'+ p_id);
        }
    }
    deletePenobrolComCom();
}
