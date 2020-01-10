var conn = require('../../b');
var pool = require('../../b');
var dbcon = require('../../db/dbconnection');
var parser = require('../../db/parser.js');
var jsForBack = require('../../back/jsForBack.js');

/************FOR TANDYA************/
exports.getTandya = function (req, res) {
    var sql1 = 'select t.*, u.u_id from tandya as t join users as u on t.author = u.id order by date desc limit 3';
    var sql2 = 'select t.*, u.u_id from tandya as t join users as u on t.author = u.id ORDER BY score DESC limit 3';
    var sql3 = 'select * from tandya_hashtag where t_id = ?';
    var sql4 = 'select * from tandya_hashtag where t_id = ?';

    async function getOrderedT() {
        var byDate = (await dbcon.oneArg(sql1)).map(parser.parseFrontTandya);
        var byScore = (await dbcon.oneArg(sql2)).map(parser.parseFrontTandya);

        for(const t of byDate)
            t.hashtags = (await dbcon.twoArg(sql3, t.id)).map(parser.parseHashtagT);
        for(const t of byScore)
            t.hashtags = (await dbcon.twoArg(sql4, t.id)).map(parser.parseHashtagT);

        res.render('./jt/t', {
            dateTopics: byDate,
            scoreTopics: byScore,
            u_id: req.session.u_id,
            id2: req.session.id2
        });
    }
    getOrderedT();
};

exports.getViewTandya = function (req, res) {
    var id = req.params.tandya_no;
    var tandya = [];
    var t_answers = [];
    var t_hashtags = [];
    var ta_comments = [];
    var t_likes = [];
    var ta_likes = [];
    var checkId = /^[0-9]+$/;
    if (checkId.test(id)) {
        var sql1 = 'SELECT MAX(id) AS max from tandya';
        conn.conn.query(sql1, function (err, maxValue, fields) {
            if (err) {
                console.log(err);
            } else if (maxValue[0].max < id) {
                res.redirect('/tandya/'); //change to redirect and make a file
            } else {
                async function getT() {
                    var sql2 = 'UPDATE tandya SET t_view = t_view + 1 WHERE id = ?';
                    var sql3 = 'UPDATE tandya SET score = ((select count(t_id) from t_ans where t_id = ?) *.3 + (select count(t_id) from t_like where t_id = ?)*.7)/t_view * 100 where id = ?';
                    var sql4 = 'select t.*, u.u_id from tandya as t join users as u on t.author = u.id where t.id = ?';
                    var sql5 = 'SELECT t.*, u.u_id FROM t_ans as t join users as u on t.author = u.id WHERE t_id = ? order by score desc';
                    var sql6 = 'SELECT * FROM tandya_hashtag where t_id = ?';
                    var sql7 = 'SELECT t.*, u.u_id FROM ta_com as t join users as u on t.author = u.id WHERE t.ta_id = ?';
                    var sql8 = 'SELECT * from t_like where t_id = ?';
                    var sql9 = 'SELECT * from ta_like where ta_id = ?';
                    await dbcon.twoArg(sql2, id);
                    await dbcon.fourArg(sql3, id, id, id);
                    tandya = parser.parseTandya((await dbcon.twoArg(sql4, id))[0]);
                    tandya.answers = (await dbcon.twoArg(sql5, id)).map(parser.parseAnswer);
                    tandya.hashtags = (await dbcon.twoArg(sql6, id)).map(parser.parseHashtagT);
                    for(const a of tandya.answers) {
                        a.comments = (await dbcon.twoArg(sql7, a.id)).map(parser.parseAComment);
                        a.likes = (await dbcon.twoArg(sql9, a.id)).map(parser.parseALike);
                        console.log(a);
                    }
                    tandya.likes = (await dbcon.twoArg(sql8, id)).map(parser.parseTLike);
                    res.render('./jt/t-view', {
                        topic: tandya,
                        u_id: req.session.u_id,
                        id2: req.session.id2
                    });
                }

                getT();
            }
        });
    } else {
        res.redirect('/tandya/');
    }
};

exports.getAddTandya = function (req, res) {
    if (req.session.u_id) {
        res.render('./jt/t-add', {u_id: 'y'});
    } else {
        res.redirect('/tandya/');
    }
};
exports.postAddTandya = function (req, res) {
    var author = req.session.u_id;
    var content = req.body.content;
    var question = req.body.question;
    var rawhashtags = req.body.hashtag;
    var thumbnail = req.body.thumbnail;
    var public = req.body.public;
    var finalhashtag = jsForBack.finalHashtagMaker(rawhashtags);

    var sql1 = "INSERT INTO tandya(author, question, content, public, thumbnail) VALUES ((select id from users where u_id = ?), ?, ?, ?, ?)";
    var sql2 = "INSERT INTO tandya_hashtag (t_id, hash) VALUES (?, ?)";

    async function insertHashtag(query, id, hashtagArray) {
        for (var i = 0; i < hashtagArray.length; i++) {
            await dbcon.threeArg(query, id, hashtagArray[i]);
        }
        res.json({
            "id" : id
        });
    }

    conn.conn.query(sql1, [author, question, content, public, thumbnail], function (err, result, fields) {
        if (err) {
            console.log(err);
        } else {
            insertHashtag(sql2, result.insertId, finalhashtag);
        }
    });
};

exports.postAddAnswer = function (req, res) {
    var author = req.session.u_id;
    var answer = req.body.answer;
    var t_id = req.params.tandya_no;
    //when connection is more than two, divide
    var sql1 = 'INSERT INTO t_ans (author, answer, t_id) VALUES ((select id from users where u_id = ?), ?, ?)';
    var sql2 = 'UPDATE tandya SET score = ((select count(t_id) from t_ans where t_id = ?) *.3 + (select count(t_id) from t_like where t_id = ?)*.7)/t_view * 100 where id = ?'
    conn.conn.query(sql1, [author, answer, t_id], function (err, result, fields) {
        if (err) {
            console.log(err);
        } else {
            conn.conn.query(sql2, [t_id, t_id, t_id], function (err, result2, fields) {
                if (err) {
                    console.log(err);
                } else {
                    res.redirect('/tandya/' + t_id);
                }
            });
        }
    });
};

exports.postAddAcomment = function (req, res) {
    var author = req.session.u_id;
    var content = req.body.acommentContent;
    var t_id = req.params.tandya_no;
    var ta_id = req.params.answer_no;
    //when connection is more than two, divide
    var sql1 = 'UPDATE t_ans set score = ((select count(ta_id) from ta_com where ta_id = ?) *.3 + (select count(ta_id) from ta_like where ta_id = ?)*.7)/(select t_view from tandya where id = ?) * 100 where id = ?';
    var sql2 = 'INSERT INTO ta_com (author, content, ta_id) VALUES ((select id from users where u_id = ?), ?, ?)';
    var sql3 = 'SELECT t.*, u.u_id FROM ta_com as t join users as u on t.author = u.id where t.id = ?';

    conn.conn.query(sql1, [ta_id, ta_id, t_id, ta_id], function (err, result, fields) {
        if (err) {
            console.log(err);
        } else {
            conn.conn.query(sql2, [author, content, ta_id], function (err, result2, fields) {
                if (err) {
                    console.log(err);
                } else {
                    conn.conn.query(sql3, result2.insertId, function (err, ajaxResult, fields) {
                        res.json({
                            "acomment_id": ajaxResult[0].id,
                            "acomment_author": ajaxResult[0].u_id,
                            "acomment_content": ajaxResult[0].content,
                            "acomment_date": ajaxResult[0].date
                        });
                    });
                }
            });
        }
    });
};


exports.likesTandya = function (req, res) {
    var t_id = parseInt(req.body.t_id);
    var ta_id = parseInt(req.body.ta_id);
    var clickVal = parseInt(req.body.clickVal);
    var sql1 = '';
    var sql2 = 'UPDATE tandya SET score = ((select count(t_id) from t_ans where t_id = ?) *.3 + (select count(t_id) from t_like where t_id = ?)*.7)/t_view * 100 where id = ?'
    var sql3 = 'select count(t_id) as tlikeCount from t_like where t_id = ?';
    var buttonValue = '';
    if (clickVal == 1) {
        sql1 = 'DELETE FROM t_like WHERE t_id = ? AND u_id = (select id from users where u_id = ?)';
        buttonValue = 0;
    } else {
        sql1 = 'INSERT INTO t_like (t_id, u_id) VALUES (?, (select id from users where u_id = ?))';
        buttonValue = 1;
    }
    conn.conn.query(sql1, [t_id, req.session.u_id], function (err, action, fields) {
        if (err) {
            console.log(err);
        } else {
            conn.conn.query(sql2, [t_id, t_id, t_id], function (err, update, fields) {
                if (err) {
                    console.log(err);
                } else {
                    conn.conn.query(sql3, t_id, function (err, ajaxResult, fields) {
                        console.log(ajaxResult);
                        res.json({"t_like": ajaxResult[0].tlikeCount, "button": buttonValue});
                    });
                }
            });
        }
    });
};

exports.likesAnswer = function (req, res) {
    var t_id = parseInt(req.body.t_id);
    var ta_id = parseInt(req.body.ta_id);
    var clickVal = parseInt(req.body.clickVal);
    var sql1 = '';
    var sql2 = 'UPDATE t_ans set score = ((select count(ta_id) from ta_com where ta_id = ?) *.3 + (select count(ta_id) from ta_like where ta_id = ?)*.7)/(select t_view from tandya where id = ?) * 100 where id = ?';
    var sql3 = 'select count(ta_id) as taLikeCount from ta_like where ta_id = ?';
    var buttonValue = '';
    if (clickVal == 1) {
        sql1 = 'DELETE FROM ta_like WHERE ta_id = ? AND u_id = (select id from users where u_id = ?)';
        buttonValue = 0;
    } else {
        sql1 = 'INSERT INTO ta_like (ta_id, u_id) VALUES (?, (select id from users where u_id = ?))';
        buttonValue = 1;
    }
    conn.conn.query(sql1, [ta_id, req.session.u_id], function (err, action, fields) {
        if (err) {
            console.log(err);
        } else {
            conn.conn.query(sql2, [ta_id, ta_id, t_id, ta_id], function (err, update, fields) {
                if (err) {
                    console.log(err);
                } else {
                    conn.conn.query(sql3, ta_id, function (err, ajaxresult, fields) {
                        res.json({"ta_like": ajaxresult[0].taLikeCount, "button": buttonValue});
                    });
                }
            });
        }
    });
};

exports.warningTandya = function (req, res) {
    var check_sql = '';
    var warn_sql = '';
    switch(req.body.warnedItem){
        case 't':
            check_sql = 'select u_id, t_id from t_warning where u_id = ? AND t_id = ?';
            warn_sql = 'insert into t_warning(u_id, t_id) values(?, ?)';
            break;
        case 'ta':
            check_sql = 'select u_id, ta_id from ta_warning where u_id = ? AND ta_id = ?';
            warn_sql = 'insert into ta_warning(u_id, ta_id) values(?, ?)';
            break;
        case 'tac':
            check_sql = 'select u_id, tac_id from tac_warning where u_id = ? AND tac_id = ?';
            warn_sql = 'insert into tac_warning(u_id, tac_id) values(?, ?)';
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

exports.getEditTandya = function (req, res) {
    var t_id = req.params.tandya_no;
    var sql = 'select * from tandya where id = ?';
    var sql2 = 'select * from hashtag where t_id = ?';
    conn.conn.query(sql, t_id, function (err, edit, fields) {
        if (err) {
            console.log(err);
        } else {
            conn.conn.query(sql2, t_id, function (err, hashtags, fields) {
                if (err) {
                    console.log(err);
                } else {
                    if (req.session.u_id == edit[0].author) {
                        res.render('./jt/t-edit', {u_id: 'y', edit_content: edit[0], hashtags: hashtags});
                    } else {
                        res.redirect('/tandya/' + t_id);
                    }
                }
            });
        }
    });
};

exports.postEditTandya = function (req, res) {
    var question = req.body.question;
    var content = req.body.content;
    var rawhashtags = req.body.hashtag;
    var public = req.body.public;
    var hashtagCount = 0;
    var t_id = req.params.tandya_no;
    while (rawhashtags.indexOf(' ') >= 0) {
        rawhashtags = rawhashtags.replace(' ', "");
    }
    var finalhashtag = rawhashtags.split('#');
    finalhashtag.splice(0, 1);
    hashtagCount = finalhashtag.length;
    //for inserts
    var sql = 'UPDATE tandya SET question = ?, content = ?, hashtagcount = ?, public = ? where id = ?';
    var sql4 = 'Delete from hashtag where t_id = ?';
    var sql5 = '';
    //for updates
    var sql2 = 'UPDATE tandya set changed_date = now() WHERE id = ?';

    //update connection
    conn.conn.query(sql2, [t_id], function (err, update, fields) {
        if (err) {
            console.log(err);
        }
    });
    //insert connection
    conn.conn.query(sql, [question, content, hashtagCount, public, t_id], function (err, result, fields) {
        if (err) {
            console.log(err);
        } else {
            conn.conn.query(sql4, t_id, function (err, dhashtag, fields) {
                if (err) {
                    console.log(err);
                } else {
                    sql5 = insertHashtagSqlMaker(t_id, finalhashtag);
                    conn.conn.query(sql5, function (err, hashtag, fields) {
                        if (err) {
                            console.log(err);
                        } else {
                            res.redirect('/tandya/' + t_id);
                        }
                    });
                }
            });
        }
    });
};

exports.getEditTanswer = function (req, res) {
    var ta_id = req.params.tanswer_no;
    var t_id = req.params.tandya_no;
    var sql = 'select * from t_ans where id = ?';
    var sql2 = 'select * from tandya where id = ?';
    var sql3 = 'select * from hashtag where t_id = ?';
    conn.conn.query(sql, ta_id, function (err, tanswer, fields) {
        if (err) {
            console.log(err);
        } else {
            conn.conn.query(sql2, t_id, function (err, tandya, fields) {
                if (err) {
                    console.log(err);
                } else {
                    conn.conn.query(sql3, t_id, function (err, hashtag, fields) {
                        if (err) {
                            console.log(err);
                        } else {
                            if (req.session.u_id == tanswer[0].author) {
                                res.render('./jt/ta-edit', {
                                    u_id: 'y',
                                    topic: tandya[0],
                                    edit_content: tanswer[0],
                                    hashtag: hashtag
                                });
                            } else {
                                res.redirect('/tandya/' + t_id);
                            }
                        }

                    });
                }
            });
        }
    });
};

exports.postEditTanswer = function (req, res) {
    var content = req.body.answer;
    var t_id = req.params.tandya_no;
    var ta_id = req.params.tanswer_no;
    var sql = 'UPDATE t_ans SET answer = ?, changed_date = now() where id = ? AND t_id = ?';
    conn.conn.query(sql, [content, ta_id, t_id], function (err, updated, fields) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/tandya/' + t_id);
        }
    });
};
