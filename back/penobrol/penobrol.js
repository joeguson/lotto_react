var conn = require('../../b');
var parser = require('../../db/parser.js');
var jsForBack = require('../../back/jsForBack.js');
var penobrolDao = require('../../db/b-dao/penobrolDao');
var s3 = require('../../b');
const AWS = require('aws-sdk');
var fs = require('fs');
//delete dbcon after daofy
var dbcon = require('../../db/dbconnection');

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
    var writer = false;
    var checkId = /^[0-9]+$/;
    if(checkId.test(id)){
        async function getP() {
            var maxCheck = await penobrolDao.penobrolMaxId();
            if(maxCheck[0].max < id){
                res.redirect('/penobrol/');
            }
            else{
                await penobrolDao.updatePenobrolView(id);
                await penobrolDao.updatePenobrolScore(id, id, id);
                var penobrol = parser.parsePenobrol((await penobrolDao.penobrolById(id))[0]);
                penobrol.comments = (await penobrolDao.penobrolComByScore(id)).map(parser.parseComment);
                penobrol.likes = (await penobrolDao.penobrolLikeById(id)).map(parser.parsePLike);
                penobrol.hashtags = (await penobrolDao.penobrolHashtagById(id)).map(parser.parseHashtagP);
                for (const c of penobrol.comments) {
                    c.comments = (await penobrolDao.penobrolComComById(c.id)).map(parser.parseCComment);
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
    var author = req.session.u_id;
    var content = req.body.content;
    var thumbnail = req.body.thumbnail;
    var title = req.body.title;
    var rawhashtags = req.body.hashtag;
    var public = req.body.public;
    var finalHashtag = jsForBack.finalHashtagMaker(rawhashtags);
    async function postPenobrol(author, title, content, public, thumbnail) {
        var penobrol = await penobrolDao.insertPenobrol(author, title, content, public, thumbnail);
        for (var i = 0; i < finalHashtag.length; i++) {
            await penobrolDao.insertPenobrolHash(penobrol.insertId, finalHashtag[i]);
        }
        res.json({
            "id" : penobrol.insertId
        });
    }
    postPenobrol(author, title, content, public, thumbnail);
};

exports.postAddComment = function (req, res) {
    var author = req.session.u_id;
    var content = req.body.comment;
    var p_id = req.params.penobrol_no;
    async function postPenobrolComment(author, content, p_id){
        var comment = await penobrolDao.insertPenobrolCom(author, content, p_id);
        await penobrolDao.updatePenobrolScore(p_id);
        res.redirect('/penobrol/' + p_id);
    }
    postPenobrolComment(author, content, p_id);
};

exports.postAddCcomment = function (req, res) {
    var author = req.session.u_id;
    var content = req.body.ccommentContent;
    var p_id = req.params.p_id;
    var pc_id = req.params.pc_id;
    async function postPenobrolComCom(author, content, pc_id, p_id){
        await penobrolDao.updatePenobrolComScore(pc_id, pc_id, p_id, pc_id);
        var postCom = await penobrolDao.insertPenobrolComCom(author, content, pc_id);
        var postedCom = await penobrolDao.penobrolComComById(postCom[0].insertId);
        res.json({
            "ccomment_id": postedCom[0].id,
            "ccomment_author": postedCom[0].u_id,
            "ccomment_content": postedCom[0].content,
            "ccomment_date": postedCom[0].date
        });
    }
    postPenobrolComCom(author, content, pc_id, p_id);
};

exports.likesPenobrol = function (req, res) {
    var p_id = parseInt(req.body.p_id);
    var clickVal = parseInt(req.body.clickVal);
    async function likePenobrolArticle(p_id, clickVal, u_id){
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
    likePenobrolArticle(p_id, clickVal, req.session.id2);
};

exports.likesComment = function (req, res) {
    var p_id = parseInt(req.body.p_id);
    var pc_id = parseInt(req.body.pc_id);
    var clickVal = parseInt(req.body.clickVal);
    async function likePenobrolComment(p_id, pc_id, clickVal, u_id){
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
        res.json({"pc_like": ajaxResult[0].pcLikeCount, "button": buttonValue});
    }
    likePenobrolComment(p_id, pc_id, clickVal, req.session.id2);
};
exports.warningPenobrol = function (req, res) {
    var check_sql = '';
    var warn_sql = '';
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
                    checking = await penobrolDao.insertPenobrolComWarn(req.session.id2, warnedId)
                    break;
                case 'pcc':
                    checking = await penobrolDao.insertPenobrolComComWarn(req.session.id2, warnedId)
                    break;
            }
            res.json({"result": 1});
        }
    }
    warnPenobrol(req.body.warnedItem, req.body.warnedId);
};

exports.getEditPenobrol = function (req, res) {
    var p_id = req.params.penobrol_no;
    var sql = 'select p.*, u.u_id from penobrol p join users u on p.author = u.id where p.id = ?';
    var sql2 = 'select * from penobrol_hashtag where p_id = ?';
    conn.conn.query(sql, p_id, function (err, edit, fields) {
        if (err) {
            console.log(err);
        } else {
            conn.conn.query(sql2, p_id, function (err, hashtags, fields) {
                if (err) {
                    console.log(err);
                } else {
                    var penobrol = parser.parsePenobrol(edit[0]);
                    penobrol.hashtags = hashtags.map(parser.parseHashtagP);
                    if(req.session.id2 == penobrol.author){
                        res.render('./jp/p-edit', {u_id: 'y', edit_content: penobrol});
                    } else {
                        res.redirect('/penobrol/' + p_id);
                    }
                }
            });
        }
    });
};

exports.postEditPenobrol = function (req, res) {
    var title = req.body.title;
    var content = req.body.content;
    var rawhashtags = req.body.hashtag;
    var public = req.body.public;
    var hashtagCount = 0;
    var p_id = req.params.penobrol_no;
    var finalHashtag = jsForBack.finalHashtagMaker(rawhashtags);;
    //for inserts
    var sql = 'UPDATE penobrol SET title = ?, content = ?, hashtagcount = ?, public = ? where id = ?';
    var sql4 = 'Delete from hashtag where p_id = ?';
    var sql5 = '';
    //for updates
    var sql2 = 'UPDATE penobrol set changed_date = now() WHERE id = ?';

    //update connection
    conn.conn.query(sql2, [p_id], function (err, update, fields) {
        if (err) {
            console.log(err);
        }
    });
    //insert connection
    conn.conn.query(sql, [title, content, hashtagCount, public, p_id], function (err, result, fields) {
        if (err) {
            console.log(err);
        } else {
            conn.conn.query(sql4, p_id, function (err, dhashtag, fields) {
                if (err) {
                    console.log(err);
                } else {
                    sql5 = insertHashtagSqlMaker(p_id, finalhashtag);
                    conn.conn.query(sql5, function (err, hashtag, fields) {
                        if (err) {
                            console.log(err);
                        } else {
                            res.redirect('/penobrol/' + p_id);
                        }
                    });
                }
            });
        }
    });
};

exports.getEditPcomment = function (req, res) {
    var pc_id = req.params.pcomment_no;
    var p_id = req.params.penobrol_no;
    var sql = 'select * from p_com where id = ?';
    var sql2 = 'select * from penobrol where id = ?';
    var sql3 = 'select * from hashtag where p_id = ?';
    conn.conn.query(sql, pc_id, function (err, pcomment, fields) {
        if (err) {
            console.log(err);
        } else {
            conn.conn.query(sql2, p_id, function (err, penobrol, fields) {
                if (err) {
                    console.log(err);
                } else {
                    conn.conn.query(sql3, p_id, function (err, hashtag, fields) {
                        if (err) {
                            console.log(err);
                        } else {
                            if (req.session.u_id == pcomment[0].author) {
                                res.render('./jp/pc-edit', {
                                    u_id: 'y',
                                    topic: penobrol[0],
                                    edit_content: pcomment[0],
                                    hashtag: hashtag
                                });
                            } else {
                                res.redirect('/penobrol/' + p_id);
                            }
                        }
                    });
                }
            });
        }
    });
};

exports.postEditPcomment = function (req, res) {
    var content = req.body.comment;
    var p_id = req.params.penobrol_no;
    var pc_id = req.params.pcomment_no;
    async function editPcomment(content, pc_id, p_id){
        await penobrolDao.updatePenobrolCom(content, pc_id, p_id);
        res.redirect('/penobrol/' + p_id);
    }
    editPcomment(content, pc_id, p_id);
};

exports.postDeletePenobrol = function(req, res){
    var deleteId = req.body.deleteId;
    async function deletePenobrol(deleteId, u_id){
        var checkAuthor = await penobrolDao.penobrolComById(deleteId);
        if(checkAuthor[0].u_id == u_id){
            await penobrolDao.deletePenobrol(deleteId);
            res.json({"result":"deleted"});
        }
        else{
            res.redirect('/penobrol');
        }

    }
    deletePenobrol(deleteId, req.session.id2);
}

exports.postDeletePcomment = function(req, res){
    var deleteId = req.body.deleteId;
    var p_id = req.body.penobrolId
    async function deletePenobrolCom(deleteId, p_id, u_id){
        var checkAuthor = await penobrolDao.penobrolComById(deleteId);
        if(checkAuthor[0].u_id == u_id){
            await penobrolDao.deletePenobrolCom(deleteId);
            res.json({"result":"deleted"});
        }
        else{
            res.redirect('/penobrol/'+ p_id);
        }

    }
    deletePenobrolCom(deleteId, p_id, req.session.id2);
}

exports.postDeletePccomment = function(req, res){
    var deleteId = req.body.deleteId;
    var p_id = req.body.penobrolId;
    async function deletePenobrolComCom(deleteId, p_id, u_id){
        var checkAuthor = await penobrolDao.penobrolComComById(deleteId);
        if(checkAuthor[0].u_id == u_id){
            await penobrolDao.deletePenobrolComCom(deleteId);
            res.json({"result":"deleted"});
        }
        else{
            res.redirect('/penobrol/'+ p_id);
        }

    }
    deletePenobrolComCom(deleteId, p_id, req.session.id2);
}
