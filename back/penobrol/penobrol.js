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
    var finalhashtag = jsForBack.finalHashtagMaker(rawhashtags);

    var sql = "INSERT INTO penobrol (author, title, content, public, thumbnail) VALUES ((select id from users where u_id = ?), ?, ?, ?, ?)";
    var sql2 = "INSERT INTO penobrol_hashtag (p_id, hash) VALUES (?, ?)";

    async function insertHashtag(query, id, hashtagArray) {
        for (var i = 0; i < hashtagArray.length; i++) {
            await dbcon.threeArg(query, id, hashtagArray[i]);
        }
        res.json({
            "id" : id
        });
    }
    conn.conn.query(sql, [author, title, content, public, thumbnail], function (err, result, fields) {
        if (err) {
            console.log(err);
        } else {
            insertHashtag(sql2, result.insertId, finalhashtag);
        }
    });
};

exports.postAddComment = function (req, res) {
    var author = req.session.u_id;
    var content = req.body.comment;
    var p_id = req.params.penobrol_no;
    //when connection is more than two, divide
    var sql1 = 'INSERT INTO p_com (author, content, p_id) VALUES ((select id from users where u_id = ?), ?, ?)';
    var sql2 = 'UPDATE penobrol SET score = ((select count(p_id) from p_com where p_id = ?) *.3 + (select count(p_id) from p_like where p_id = ?)*.7)/p_view * 100 where id = ?'
    conn.conn.query(sql1, [author, content, p_id], function (err, result, fields) {
        if (err) {
            console.log(err);
        } else {
            conn.conn.query(sql2, [p_id, p_id, p_id], function (err, result2, fields) {
                if (err) {
                    console.log(err);
                } else {
                    res.redirect('/penobrol/' + p_id);
                }
            });
        }
    });
};

exports.postAddCcomment = function (req, res) {
    var author = req.session.u_id;
    var content = req.body.ccommentContent;
    var p_id = req.params.p_id;
    var pc_id = req.params.pc_id;
    //when connection is more than two, divide
    var sql1 = 'UPDATE p_com set score = ((select count(pc_id) from pc_com where pc_id = ?) *.3 + (select count(pc_id) from pc_like where pc_id = ?)*.7)/(select p_view from penobrol where id = ?) * 100 where id = ?';
    var sql2 = 'INSERT INTO pc_com (author, content, pc_id) VALUES ((select id from users where u_id = ?), ?, ?)';
    var sql3 = 'SELECT p.*, u.u_id FROM pc_com as p join users as u on p.author = u.id where p.id = ?';

    conn.conn.query(sql1, [pc_id, pc_id, p_id, pc_id], function (err, result, fields) {
        if (err) {
            console.log(err);
        } else {
            conn.conn.query(sql2, [author, content, pc_id], function (err, result2, fields) {
                if (err) {
                    console.log(err);
                } else {
                    conn.conn.query(sql3, result2.insertId, function (err, ajaxResult, fields) {
                        res.json({
                            "ccomment_id": ajaxResult[0].id,
                            "ccomment_author": ajaxResult[0].u_id,
                            "ccomment_content": ajaxResult[0].content,
                            "ccomment_date": ajaxResult[0].date
                        });
                    });
                }
            });
        }
    });
};

exports.likesPenobrol = function (req, res) {
    var p_id = parseInt(req.body.p_id);
    var pc_id = parseInt(req.body.pc_id);
    var clickVal = parseInt(req.body.clickVal);
    var sql1 = '';
    var sql2 = 'UPDATE penobrol SET score = ((select count(p_id) from p_com where p_id = ?) *.3 + (select count(p_id) from p_like where p_id = ?)*.7)/p_view * 100 where id = ?'
    var sql3 = 'select count(p_id) as plikeCount from p_like where p_id = ?';
    var buttonVal = '';
    if (clickVal == 1) {
        sql1 = 'DELETE FROM p_like WHERE p_id = ? AND u_id = ?';
        buttonVal = 0;
    } else {
        sql1 = 'INSERT INTO p_like (p_id, u_id) VALUES (?, ?)';
        buttonVal = 1;
    }
    conn.conn.query(sql1, [p_id, req.session.id2], function (err, action, fields) {
        if (err) {
            console.log(err);
        } else {
            conn.conn.query(sql2, [p_id, p_id, p_id], function (err, update, fields) {
                if (err) {
                    console.log(err);
                } else {
                    conn.conn.query(sql3, p_id, function (err, ajaxResult, fields) {
                        res.json({"p_like": ajaxResult[0].plikeCount, "button": buttonVal});
                    });
                }
            });
        }
    });
};

exports.likesComment = function (req, res) {
    var p_id = parseInt(req.body.p_id);
    var pc_id = parseInt(req.body.pc_id);
    var clickVal = parseInt(req.body.clickVal);
    var sql1 = '';
    var sql2 = 'UPDATE p_com set score = ((select count(pc_id) from pc_com where pc_id = ?) *.3 + (select count(pc_id) from pc_like where pc_id = ?)*.7)/(select p_view from penobrol where id = ?) * 100 where id = ?';
    var sql3 = 'select count(pc_id) as pcLikeCount from pc_like where pc_id = ?';
    var buttonValue = '';
    if (clickVal == 1) {
        sql1 = 'DELETE FROM pc_like WHERE pc_id = ? AND u_id = (select id from users where u_id = ?)';
        buttonValue = 0;
    } else {
        sql1 = 'INSERT INTO pc_like (pc_id, u_id) VALUES (?, (select id from users where u_id = ?))';
        buttonValue = 1;
    }

    conn.conn.query(sql1, [pc_id, req.session.u_id], function (err, action, fields) {
        if (err) {
            console.log(err);
        } else {
            conn.conn.query(sql2, [pc_id, pc_id, p_id, pc_id], function (err, update, fields) {
                if (err) {
                    console.log(err);
                } else {
                    conn.conn.query(sql3, pc_id, function (err, ajaxresult, fields) {
                        res.json({"pc_like": ajaxresult[0].pcLikeCount, "button": buttonValue});
                    });
                }
            });
        }
    });
};
exports.warningPenobrol = function (req, res) {
    var check_sql = '';
    var warn_sql = '';
    console.log(req.body.warnedItem);
    switch(req.body.warnedItem){
        case 'p':
            check_sql = 'select u_id, p_id from p_warning where u_id = ? AND p_id = ?';
            warn_sql = 'insert into p_warning(u_id, p_id) values(?, ?)';
            break;
        case 'pc':
            check_sql = 'select u_id, pc_id from pc_warning where u_id = ? AND pc_id = ?';
            warn_sql = 'insert into pc_warning(u_id, pc_id) values(?, ?)';
            break;
        case 'pcc':
            check_sql = 'select u_id, pcc_id from pcc_warning where u_id = ? AND pcc_id = ?';
            warn_sql = 'insert into pcc_warning(u_id, pcc_id) values(?, ?)';
            break;
    }
    conn.conn.query(check_sql, [req.session.id2, req.body.warnedId], function (err, checking, fields) {
        if (err) {
            console.log(err);
        } else {
            if (checking.length) {
                res.json({"result": 0});
            } else {
                conn.conn.query(warn_sql, [req.session.id2, req.body.warnedId], function (err, warned, fields) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.json({"result": 1});
                    }
                });

            }
        }
    });
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
    while (rawhashtags.indexOf(' ') >= 0) {
        rawhashtags = rawhashtags.replace(' ', "");
    }
    var finalhashtag = rawhashtags.split('#');
    finalhashtag.splice(0, 1);
    hashtagCount = finalhashtag.length;
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
    var sql = 'UPDATE p_com SET content = ?, changed_date = now() where id = ? AND p_id = ?';
    conn.conn.query(sql, [content, pc_id, p_id], function (err, updated, fields) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/penobrol/' + p_id);
        }
    });
};

exports.postDeletePenobrol = function(req, res){
  var deleteId = req.body.deleteId;
  var checkAuthor = 'select p.author, u.u_id from penobrol p inner join users u on p.author = u.id where p.id = ?';
  var deleteQuery = 'Delete from penobrol where id = ?';
  conn.conn.query(checkAuthor, deleteId, function(err, getAuthor, fields){
    if(err){console.log(err);}
    else{
      if(getAuthor[0].u_id == req.session.u_id){
        conn.conn.query(deleteQuery, deleteId, function(err, deleteP, fields){
          if(err){console.log(err);}
          else{
            console.log(deleteP);
            res.json({"result":"deleted"});
          }
        });
      }
      else{
        res.redirect('/penobrol');
      }
    }
  });
}

exports.postDeletePcomment = function(req, res){
  var deleteId = req.body.deleteId;
  var p_id = req.body.penobrolId
  var checkAuthor = 'select p.author, u.u_id from p_com p inner join users u on p.author = u.id where p.id = ?';
  var deleteQuery = 'Delete from p_com where id = ?';
  conn.conn.query(checkAuthor, deleteId, function(err, getAuthor, fields){
    if(err){console.log(err);}
    else{
      if(getAuthor[0].u_id == req.session.u_id){
        conn.conn.query(deleteQuery, deleteId, function(err, deleteP, fields){
          if(err){console.log(err);}
          else{
            res.json({"result":"deleted"});
          }
        });
      }
      else{
        res.redirect('/penobrol/'+p_id);
      }
    }
  });
}
exports.postDeletePccomment = function(req, res){
  var deleteId = req.body.deleteId;
  var p_id = req.body.penobrolId
  var checkAuthor = 'select p.author, u.u_id from pc_com p inner join users u on p.author = u.id where p.id = ?';
  var deleteQuery = 'Delete from pc_com where id = ?';
  conn.conn.query(checkAuthor, deleteId, function(err, getAuthor, fields){
    if(err){console.log(err);}
    else{
      if(getAuthor[0].u_id == req.session.u_id){
        conn.conn.query(deleteQuery, deleteId, function(err, deleteP, fields){
          if(err){console.log(err);}
          else{
            res.json({"result":"deleted"});
          }
        });
      }
      else{
        res.redirect('/penobrol/'+p_id);
      }
    }
  });
}
