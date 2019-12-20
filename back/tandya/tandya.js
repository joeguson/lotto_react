var conn = require('../../b');

/************FOR TANDYA************/
exports.getTandya = function(req, res){
    var sql = 'select * from tandya order by date desc limit 3';
    var sql2 = 'SELECT * FROM tandya ORDER BY score DESC limit 3';
    var sql3 = '';
    conn.conn.query(sql, function(err, dateOrder, fields){
        if(err){console.log(err);}
        else{
            conn.conn.query(sql2, function(err, scoreOrder, fields){
                if(err){console.log(err);}
                else{
                    sql3 = htsqlMaker(dateOrder, scoreOrder);
                    conn.conn.query(sql3, function(err, hashtag, fields){
                        if(err){console.log(err);}
                        else{
                            if(req.session.u_id){
                                res.render('./jt/t', {dateTopics:dateOrder, scoreTopics:scoreOrder, hashtags:hashtag, u_id:req.session.u_id});
                            }
                            else{
                                res.render('./jt/t', {dateTopics:dateOrder, scoreTopics:scoreOrder, hashtags:hashtag});
                            }
                        }
                    });
                }
            });
        }
    });
};
exports.getViewTandya =  function(req, res){
    var id = req.params.tandya_no;
    var checkId = /^[0-9]+$/;
    if(checkId.test(id)){
        var sql1 = 'SELECT MAX(id) AS max from tandya';
        var sql3 = 'UPDATE tandya SET t_view = t_view + 1 WHERE id = ?';
        var sql7 = 'UPDATE tandya SET score = (answer *.3 + t_like*.7)/t_view * 100 where id = ?';
        var sql = 'SELECT * FROM tandya WHERE id = ?';
        var sql2 = 'SELECT * FROM t_ans WHERE t_id = ? order by score desc';
        var sql6 = 'SELECT * FROM hashtag where t_id = ?';
        var sql4 = 'Select * from t_like where u_id = ? AND t_id = ?';
        var sql5 = 'SELECT * FROM ta_com where t_id = ?';
        var sql8 = 'SELECT * FROM ta_like where u_id = ? AND t_id = ?';
        conn.conn.query(sql1, function(err, maxValue, fields){
            if(maxValue[0].max < id){
                res.redirect('/tandya'); //change to redirect and make a file
            }
            else{
                conn.conn.query(sql3, [id], function(err, views, fields){
                    if(err){console.log(err);}
                    else{
                        conn.conn.query(sql7, id, function(err, score, fields){
                            if(err){console.log(err);}
                        });
                    }
                });
                conn.conn.query(sql, id, function(err, content, fields){
                    if(err){console.log(err);}
                    else{
                        conn.conn.query(sql2, id, function(err, answers, fields){
                            if(err){console.log(err);}
                            else{
                                conn.conn.query(sql6, id, function(err, hashtag, fields){
                                        if(err){console.log(err);}
                                        else{
                                            conn.conn.query(sql5, id, function(err, acomments, fields){
                                                if(err){console.log(err);}
                                                else{
                                                    if(req.session.u_id){
                                                        conn.conn.query(sql4, [req.session.u_id, id], function(err, likeStatus, fields){
                                                            if(err){console.log(err);}
                                                            else{
                                                                conn.conn.query(sql8, [req.session.u_id, id], function(err, alikeStatus, fields){
                                                                    if(err){console.log(err);}
                                                                    else{
                                                                        var statusCheck = '';
                                                                        if(isEmpty(likeStatus)){
                                                                            statusCheck = 'no';
                                                                        }
                                                                        else{
                                                                            statusCheck = 'yes';
                                                                        }
                                                                        res.render('./jt/t-view', {topic:content[0], statusCheck:statusCheck, answers:answers, u_id:req.session.u_id, hashtag:hashtag, acomments:acomments, alikeStatus:alikeStatus});
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    }
                                                    else{
                                                        res.render('./jt/t-view', {topic:content[0], answers:answers, hashtag:hashtag, acomments:acomments});
                                                    }
                                                }

                                            });

                                        }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
    else{
        res.redirect('/tandya');
    }
};

exports.getAddTandya = function(req, res){
  if(req.session.u_id){
        res.render('./jt/t-add', {u_id:'y'});
    }
    else{
        res.send('/tandya/belumadakonten'); //change to redirect and make a file
    }
};
exports.postAddTandya = function(req, res){
    var author = req.session.u_id;
    var content = req.body.content;
    var question = req.body.question;
    var rawhashtags = req.body.hashtag;
    var hashtagCount = 0;
    var public = req.body.public;
    while(rawhashtags.indexOf(' ')>=0){
        rawhashtags = rawhashtags.replace(' ', "");
    }
    var finalhashtag = rawhashtags.split('#');
    finalhashtag.splice(0,1);
    hashtagCount = finalhashtag.length;
    var sql = 'INSERT INTO tandya (author, question, content, hashtagcount, public) VALUES (?, ?, ?, ?, ?)';
    var sql2='UPDATE users set u_tan= u_tan + 1 WHERE u_id = ?';
    //update connection
    conn.conn.query(sql2, [author], function(err, update, fields){
        if(err){console.log(err);}
      });
    //insert connection
    conn.conn.query(sql, [author, question, content, hashtagCount, public], function(err, result, fields){
        if(err){console.log(err);}
        else{
            var sql4 = insertHashtagSqlMaker(result.insertId, finalhashtag);
            conn.conn.query(sql4, function(err, hashtag, fields){
                if(err){console.log(err);}
                else{ res.redirect('/tandya/'+result.insertId);
                }
            });
        }
    });
};

exports.postAddAnswer = function(req, res){
    var author = req.session.u_id;
    var answer = req.body.answer;
    var t_id = req.params.tandya_no;
    var sql = 'INSERT INTO t_ans (author, answer, t_id) VALUES (?, ?, ?)';
    var sql2 = 'UPDATE tandya SET answer = answer + 1 WHERE id = (?)';
    var sql3 = 'UPDATE tandya SET score = (answer *.3 + t_like*.7)/t_view * 100 where id = ?';
    conn.conn.query(sql, [author, answer, t_id], function(err, result, fields){
        if(err){console.log(err);}
        else{
            conn.conn.query(sql2, [t_id], function(err, result2, fields){
                if(err){
                    console.log(err);
                }
                else{
                    conn.conn.query(sql3, t_id, function(err, score, fields){
                        if(err){console.log(err);}
                    });
                }
            });
            res.redirect('/tandya/'+t_id);
        }
    });
};

exports.postAddAcomment = function(req, res){
    var author = req.session.u_id;
    var content = req.body.acommentContent;
    var t_id = req.params.tandya_no;
    var ta_id = req.params.answer_no;
    //when connection is more than two, divide
    var sql = 'INSERT INTO ta_com (author, content, ta_id, t_id) VALUES (?, ?, ?, ?)';
    var sql2 = 'UPDATE t_ans SET com = com + 1 WHERE id = ?';
    var sql3 = 'UPDATE t_ans SET score = com*.3 + ta_like*.7 where id = ?';
    var sql4 = 'SELECT * FROM ta_com where id = ?';
    conn.conn.query(sql, [author, content, ta_id, t_id], function(err, result, fields){
        if(err){console.log(err);}
        else{
            conn.conn.query(sql2, [ta_id], function(err, result2, fields){
                if(err){console.log(err)}
                else{
                    conn.conn.query(sql3, ta_id, function(err, result3, fields){
                        if(err){console.log(err)}
                        else{
                            conn.conn.query(sql4, result.insertId, function(err, ajaxResult, fields){
                                res.json({"acomment_id" : ajaxResult[0].id, "acomment_author" : ajaxResult[0].author, "acomment_content" : ajaxResult[0].content, "acomment_date" : ajaxResult[0].date});
                            });
                        }
                    });
                }
            });
        }
    });
};


exports.likesTandya = function(req, res){
    var clickValue = req.body.clickedValue;
    var t_id = req.params.id;
    var sql = 'SELECT * FROM t_like WHERE u_id = ? AND t_id = ?';
    var sql2 = 'UPDATE tandya set t_like = t_like - 1 where id = ?';
    var sql3 = 'DELETE FROM t_like WHERE u_id = ? AND t_id = ?';
    var sql4 = 'UPDATE tandya set t_like = t_like + 1 where id = ?';
    var sql5 = 'INSERT INTO t_like (t_id, u_id) VALUES (?, ?)';
    var sql6 = 'select t_like from tandya where id = ?';
    var sql7 = 'UPDATE tandya SET score = (answer *.3 + t_like*.7)/t_view * 100 where id = ?';
    conn.conn.query(sql, [req.session.u_id, t_id], function(err, statusCheck, fields){
        if(clickValue == 'Batal Suka'){
            conn.conn.query(sql2, t_id, function(err, update, fields){
                conn.conn.query(sql3, [req.session.u_id, t_id], function(err, deleting, fields){
                    if(err){console.log(err);}
                    else{
                        conn.conn.query(sql6, t_id, function(err, ajaxresult, fields){
                            res.json({"t_like" : ajaxresult[0].t_like, "button" : "Suka"});
                        });
                    }
                });
            });
        }
        else{
            conn.conn.query(sql4, t_id, function(err, update, fields){
                conn.conn.query(sql5, [t_id, req.session.u_id], function(err, inserting, fields){
                    if(err){console.log(err);}
                    else{
                        conn.conn.query(sql6, t_id, function(err, ajaxresult, fields){
                            res.json({"t_like" : ajaxresult[0].t_like, "button" : "Batal Suka"});
                        });
                    }
                });
            });
        }
    });
    conn.conn.query(sql7, t_id, function(err, score, fields){
        if(err){console.log(err);}
    });
};
exports.likesAnswer = function(req, res){
    var clickValue = req.body.clickedValue;
    var t_id = req.body.t_id;
    var ta_id = req.body.ta_id;
    var sql = 'SELECT * FROM ta_like WHERE u_id = ? AND ta_id = ?';
    var sql2 = 'UPDATE t_ans set ta_like = ta_like - 1 where id = ?';
    var sql3 = 'DELETE FROM ta_like WHERE u_id = ? AND ta_id = ? AND t_id';
    var sql4 = 'UPDATE t_ans set ta_like = ta_like + 1 where id = ?';
    var sql5 = 'INSERT INTO ta_like (ta_id, u_id, t_id) VALUES (?, ?, ?)';
    var sql6 = 'select ta_like from t_ans where id = ?';
    var sql7 = 'UPDATE tandya SET score = com*.3 + ta_like*.7 where id = ?';
    conn.conn.query(sql, [req.session.u_id, ta_id], function(err, statusCheck, fields){
        if(clickValue == 'Batal Suka'){
            conn.conn.query(sql2, ta_id, function(err, update, fields){
                conn.conn.query(sql3, [req.session.u_id, ta_id, t_id], function(err, deleting, fields){
                    if(err){console.log(err);}
                    else{
                        conn.conn.query(sql6, ta_id, function(err, ajaxresult, fields){
                            res.json({"ta_like" : ajaxresult[0].ta_like, "button" : "Suka"});
                        });
                    }
                });
            });
        }
        else{
            conn.conn.query(sql4, ta_id, function(err, update, fields){
                conn.conn.query(sql5, [ta_id, req.session.u_id, t_id], function(err, inserting, fields){
                    if(err){console.log(err);}
                    else{
                        conn.conn.query(sql6, ta_id, function(err, ajaxresult, fields){
                            res.json({"ta_like" : ajaxresult[0].ta_like, "button" : "Batal Suka"});
                        });
                    }
                });
            });
        }
    });
    conn.conn.query(sql7, t_id, function(err, score, fields){
        if(err){console.log(err);}
    });
};

exports.warningTandya = function(req, res){
    var t_id = parseInt(req.body.warnedT);
    var ta_id = parseInt(req.body.warnedA);
    var tac_id = parseInt(req.body.warnedC);
    var sql = '';
    var checking_sql = 'select u_id, t_id, ta_id, tac_id from warning where u_id = ? AND t_id = ? AND ta_id = ? AND tac_id = ?';
    conn.conn.query(checking_sql, [req.session.u_id, t_id, ta_id, tac_id], function(err, checking, fields){
        if(err){console.log(err);}
        else{
            if(checking.length){
                res.json({"result":"alreadywarned"});
            }
            else{
                switch(req.body.warnedItem){
                    case "tan":
                        sql = 'INSERT INTO warning (u_id, t_id, ta_id, tac_id) VALUES (?, ?, 0, 0)';
                        break;
                    case "ans":
                        sql = 'INSERT INTO warning (u_id, t_id, ta_id, tac_id) VALUES(?, ?, ?, 0)';
                        break;
                    case "tac":
                        sql = 'INSERT INTO warning (u_id, t_id, ta_id, tac_id) VALUES(?, ?, ?, ?)';
                }
                conn.conn.query(sql, [req.session.u_id, t_id, ta_id, tac_id], function(err, warned, fields){
                    if(err){console.log(err);}
                    else{
                        res.json({"result":"warned"});
                    }
                });

            }
        }
    });
};

exports.getEditTandya = function(req, res){
    var t_id = req.params.tandya_no;
    var sql = 'select * from tandya where id = ?';
    var sql2 = 'select * from hashtag where t_id = ?';
    conn.conn.query(sql, t_id, function(err, edit, fields){
        if(err){console.log(err);}
        else{
            conn.conn.query(sql2, t_id, function(err, hashtags, fields){
                if(err){console.log(err);}
                else{
                    if(req.session.u_id == edit[0].author){
                        res.render('./jt/t-edit', {u_id:'y', edit_content:edit[0], hashtags:hashtags});
                    }
                    else{
                        res.redirect('/tandya/'+t_id);
                    }
                }
            });
        }
    });
};

exports.postEditTandya = function(req, res){
    var question = req.body.question;
    var content = req.body.content;
    var rawhashtags = req.body.hashtag;
    var public = req.body.public;
    var hashtagCount = 0;
    var t_id = req.params.tandya_no;
    while(rawhashtags.indexOf(' ')>=0){
        rawhashtags = rawhashtags.replace(' ', "");
    }
    var finalhashtag = rawhashtags.split('#');
    finalhashtag.splice(0,1);
    hashtagCount = finalhashtag.length;
    //for inserts
    var sql = 'UPDATE tandya SET question = ?, content = ?, hashtagcount = ?, public = ? where id = ?';
    var sql4 = 'Delete from hashtag where t_id = ?';
    var sql5 = '';
    //for updates
    var sql2 = 'UPDATE tandya set changed_date = now() WHERE id = ?';

    //update connection
    conn.conn.query(sql2, [t_id], function(err, update, fields){
        if(err){console.log(err);}
      });
    //insert connection
    conn.conn.query(sql, [question, content, hashtagCount, public, t_id], function(err, result, fields){
        if(err){console.log(err);}
        else{
            conn.conn.query(sql4, t_id, function(err, dhashtag, fields){
                if(err){console.log(err);}
                else{
                    sql5 = insertHashtagSqlMaker(t_id, finalhashtag);
                    conn.conn.query(sql5, function(err, hashtag, fields){
                        if(err){console.log(err);}
                        else{
                            res.redirect('/tandya/'+t_id);
                        }
                    });
                }
            });
        }
    });
};

exports.getEditTanswer = function(req, res){
    var ta_id = req.params.tanswer_no;
    var t_id = req.params.tandya_no;
    var sql = 'select * from t_ans where id = ?';
    var sql2 = 'select * from tandya where id = ?';
    var sql3 = 'select * from hashtag where t_id = ?';
    conn.conn.query(sql, ta_id, function(err, tanswer, fields){
        if(err){console.log(err);}
        else{
            conn.conn.query(sql2, t_id, function(err, tandya, fields){
                if(err){console.log(err);}
                else{
                    conn.conn.query(sql3, t_id, function(err, hashtag, fields){
                        if(err){console.log(err);}
                        else{
                            if(req.session.u_id == tanswer[0].author){
                                res.render('./jt/ta-edit', {u_id:'y', topic:tandya[0], edit_content:tanswer[0], hashtag:hashtag});
                            }
                            else{
                                res.redirect('/tandya/'+t_id);
                            }
                        }

                    });
                }
            });
        }
    });
};

exports.postEditTanswer = function(req, res){
    var content = req.body.answer;
    var t_id = req.params.tandya_no;
    var ta_id = req.params.tanswer_no;
    var sql = 'UPDATE t_ans SET answer = ?, changed_date = now() where id = ? AND t_id = ?';
    conn.conn.query(sql, [content, ta_id, t_id], function(err, updated, fields){
        if(err){console.log(err);}
        else{
            res.redirect('/tandya/'+t_id);
        }
    });
};
