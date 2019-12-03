var conn = require('./b');

/************FOR PENOBROL************/
function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

var htsqlMaker = function(dateOrder, scoreOrder){
    var dlength = dateOrder.length;
    var slength = scoreOrder.length;
    var dtemp = [];
    var stemp = [];
    for(var i =0; i<dlength;i++){
        dtemp.push(dateOrder[i].id);
    }
    for(var j =0; j<slength;j++){
        stemp.push(scoreOrder[j].id);
    }
    dtemp = dtemp.concat(stemp);
    var temp = 'select * from hashtag where ';
    for(var k = 0; k<dtemp.length; k++){
        temp = temp + 'p_id = '+dtemp[k] + ' OR ';
    }
    temp = temp.slice(0,-1);
    temp = temp.slice(0,-1);
    temp = temp.slice(0,-1);
    temp = temp.slice(0,-1);
    return temp;
};

var insertHashtagSqlMaker = function(p_id, hashArray){
    var temp = 'insert into hashtag (p_id, hash) values ';
    for(var i = 0; i<hashArray.length; i++){
        temp = temp + '('+p_id+", '"+hashArray[i]+"'), ";
    }
    temp = temp.slice(0,-1);
    temp = temp.slice(0,-1);
    return temp;
};

exports.getPenobrol = function(req, res){
    var sql = 'SELECT * from penobrol order by date desc limit 3';
    var sql2 = 'SELECT * FROM penobrol ORDER BY score DESC limit 3';
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
                            res.render('p', {dateTopics:dateOrder, scoreTopics:scoreOrder, hashtags:hashtag, u_id:req.session.u_id});
                            }
                            else{
                                res.render('p', {dateTopics:dateOrder, scoreTopics:scoreOrder, hashtags:hashtag});
                            }
                        }
                    });
                }
            });
        }
    });
};

exports.getViewPenobrol = function(req, res){
    var id = req.params.penobrol_no;
    var checkId = /^[0-9]+$/;
    if(checkId.test(id)){
        var sql1 = 'SELECT MAX(id) AS max from penobrol';
        var sql3 = 'UPDATE penobrol SET p_view = p_view + 1 WHERE id = ?';
        var sql5 = 'UPDATE penobrol SET score = (com *.3 + p_like*.7)/p_view * 100 where id = ?';
        var sql = 'SELECT * FROM penobrol WHERE id = ?';
        var sql2 = 'SELECT * FROM p_com WHERE p_id = ? order by score desc';
        var sql6 = 'SELECT * FROM hashtag where p_id = ?';
        var sql4 = 'SELECT * FROM p_like WHERE u_id = ? AND p_id = ?';
        var sql7 = 'SELECT * FROM pc_com WHERE p_id = ?';
        var sql8 = 'SELECT * FROM pc_like where u_id = ? AND p_id = ?';
        conn.conn.query(sql1, function(err, maxValue, fields){
            if(maxValue[0].max < id){
                res.redirect('/penobrol/'); //change to redirect and make a file
            }
            else{
                conn.conn.query(sql3, id, function(err, views, fields){
                    if(err){console.log(err);}
                    else{
                        conn.conn.query(sql5, id, function(err, score, fields){
                            if(err){console.log(err);}
                        });
                    }
                });
                conn.conn.query(sql, id, function(err, content, fields){
                if(err){console.log(err);}
                else{
                    conn.conn.query(sql2, id, function(err, comments, fields){
                    if(err){console.log(err);}
                    else{

                        conn.conn.query(sql6, id, function(err, hashtag, fields){
                        if(err){console.log(err);}
                        else{
                            if(err){console.log(err);}
                            else{
                                conn.conn.query(sql7, id, function(err, ccomments, fields){
                                    if(req.session.u_id){
                                        conn.conn.query(sql4, [req.session.u_id, id], function(err, likeStatus, fields){
                                            if(err){console.log(err);}
                                            else{
                                                conn.conn.query(sql8, [req.session.u_id, id], function(err, clikeStatus, fields){
                                                    if(err){console.log(err);}
                                                    else{
                                                        var statusCheck = '';
                                                        if(isEmpty(likeStatus)){
                                                            statusCheck = 'no';
                                                        }
                                                        else{
                                                            statusCheck = 'yes';
                                                        }
                                                        res.render('p-view', {topic:content[0], statusCheck:statusCheck, comments:comments, u_id:req.session.u_id, hashtag:hashtag, ccomments:ccomments, clikeStatus:clikeStatus});
                                                    }   
                                                });
                                                    
                                            }
                                        });
                                    }
                                    else{
                                        res.render('p-view', {topic:content[0], comments:comments, hashtag:hashtag, ccomments:ccomments});
                                    }
                                });
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
    else{
        res.redirect('/penobrol/');
    }
};
exports.getAddPenobrol = function(req, res){
    if(req.session.u_id){
        res.render('p-add', {u_id:'y'});
    }
    else{
        res.redirect('/penobrol/');
    }
};
exports.postAddPenobrol = function(req, res){
    console.log(req.body);
    var author = req.session.u_id;
    var content = req.body.content;
    var title = req.body.title;
    var rawhashtags = req.body.hashtag;
    var public = req.body.public;
    var hashtagCount = 0;
    while(rawhashtags.indexOf(' ')>=0){
        rawhashtags = rawhashtags.replace(' ', "");
    }
    var finalhashtag = rawhashtags.split('#');
    finalhashtag.splice(0,1);
    hashtagCount = finalhashtag.length;
    //for inserts
    var sql = 'INSERT INTO penobrol (author, title, content, hashtagcount, public) VALUES (?, ?, ?, ?, ?)';
    var sql2 = 'UPDATE users set u_pen= u_pen + 1 WHERE u_id = ?';
    //update connection
    conn.conn.query(sql2, [author], function(err, update, fields){
        if(err){console.log(err);}
      });
    //insert connection
    conn.conn.query(sql, [author, title, content, hashtagCount, public], function(err, result, fields){
        if(err){console.log(err);}
        else if(hashtagCount > 0){
            var sql4 = insertHashtagSqlMaker(result.insertId, finalhashtag);
            conn.conn.query(sql4, function(err, hashtag, fields){
                if(err){console.log(err);}
                else{
                    res.redirect('/penobrol/'+result.insertId);
                }
            }); 
        }
        else{
            res.redirect('/penobrol/'+result.insertId);
        }
    });
};

exports.postAddComment = function(req, res){
    var author = req.session.u_id;
    var content = req.body.comment;
    var p_id = req.params.penobrol_no;
    //when connection is more than two, divide
    var sql = 'INSERT INTO p_com (author, content, p_id) VALUES (?, ?, ?)';
    var sql2 = 'UPDATE penobrol SET com = com + 1 WHERE id = (?)';
    var sql3 = 'UPDATE penobrol SET score = (com *.3 + p_like*.7)/p_view * 100 where id = ?';
    conn.conn.query(sql3, p_id, function(err, score, fields){
        if(err){console.log(err);}
    });
    conn.conn.query(sql, [author, content, p_id], function(err, result, fields){
        if(err){console.log(err);}
        else{
            conn.conn.query(sql2, [p_id], function(err, result2, fields){
                res.redirect('/penobrol/'+p_id);
            });
        }
    });  
};

exports.postAddCcomment = function(req, res){
    var author = req.session.u_id;
    var content = req.body.ccommentContent;
    var p_id = req.params.penobrol_no;
    var pc_id = req.params.comment_no;
    //when connection is more than two, divide
    var sql = 'INSERT INTO pc_com (author, content, pc_id, p_id) VALUES (?, ?, ?, ?)';
    var sql2 = 'UPDATE p_com SET com = com + 1 WHERE id = ?';
    var sql3 = 'UPDATE p_com SET score = pc_like*0.7 + com*0.3 where id = ?';
    var sql4 = 'SELECT * FROM pc_com where id = ?';
    conn.conn.query(sql, [author, content, pc_id, p_id], function(err, result, fields){
        if(err){console.log(err);}
        else{
            conn.conn.query(sql2, [pc_id], function(err, result2, fields){
                if(err){console.log(err);}
                else{
                    conn.conn.query(sql3, pc_id, function(err, result3, fields){
                        if(err){console.log(err);}
                        else{
                            conn.conn.query(sql4, result.insertId, function(err, ajaxResult, fields){
                                res.json({"ccomment_id" : ajaxResult[0].id, "ccomment_author" : ajaxResult[0].author, "ccomment_content" : ajaxResult[0].content, "ccomment_date" : ajaxResult[0].date});
                            });
                        }
                    });
                }
            });
        }
    });  
};

exports.likesPenobrol = function(req, res){
    var clickValue = req.body.clickedValue;
    var p_id = req.params.id;
    var sql = 'SELECT * FROM p_like WHERE u_id = ? AND p_id = ?';
    var sql2 = 'UPDATE penobrol set p_like = p_like - 1 where id = ?';
    var sql4 = 'UPDATE penobrol set p_like = p_like + 1 where id = ?';
    var sql7 = 'UPDATE penobrol SET score = (com *.3 + p_like*.7)/p_view * 100 where id = ?';
    
    var sql3 = 'DELETE FROM p_like WHERE u_id = ? AND p_id = ?';
    var sql5 = 'INSERT INTO p_like (p_id, u_id) VALUES (?, ?)';
    var sql6 = 'select p_like from penobrol where id = ?';

    conn.conn.query(sql, [req.session.u_id, p_id], function(err, statusCheck, fields){
        if(clickValue == 'Batal Suka'){
            conn.conn.query(sql2, p_id, function(err, update, fields){
                conn.conn.query(sql3, [req.session.u_id, p_id], function(err, deleting, fields){
                    if(err){console.log(err);}
                    else{
                        conn.conn.query(sql6, p_id, function(err, ajaxresult, fields){
                            res.json({"p_like" : ajaxresult[0].p_like, "button" : "Suka"});
                        });
                    }
                });    
            });
        }
        else{
            conn.conn.query(sql4, p_id, function(err, update, fields){
                conn.conn.query(sql5, [p_id, req.session.u_id], function(err, inserting, fields){
                    if(err){console.log(err);}
                    else{
                        conn.conn.query(sql6, p_id, function(err, ajaxresult, fields){
                            res.json({"p_like" : ajaxresult[0].p_like, "button" : "Batal Suka"});
                        });
                    }
                });    
            });
        }
    });
    conn.conn.query(sql7, p_id, function(err, score, fields){
        if(err){console.log(err);}
    });
};

exports.likesComment = function(req, res){
    var clickValue = req.body.clickedValue;
    var p_id = req.body.p_id;
    var pc_id = req.body.pc_id;
    var sql = 'SELECT * FROM pc_like WHERE u_id = ? AND pc_id = ?';
    var sql2 = 'UPDATE p_com set pc_like = pc_like - 1 where id = ?';
    var sql3 = 'DELETE FROM pc_like WHERE u_id = ? AND pc_id = ? AND p_id';
    var sql4 = 'UPDATE p_com set pc_like = pc_like + 1 where id = ?';
    var sql5 = 'INSERT INTO pc_like (pc_id, u_id, p_id) VALUES (?, ?, ?)';
    var sql6 = 'select pc_like from p_com where id = ?';
    var sql7 = 'UPDATE p_com SET score = pc_like*0.7 + com*0.3 where id = ?';
    conn.conn.query(sql, [req.session.u_id, pc_id], function(err, statusCheck, fields){
        if(clickValue == 'Batal Suka'){
            conn.conn.query(sql2, pc_id, function(err, update, fields){
                conn.conn.query(sql3, [req.session.u_id, pc_id, p_id], function(err, deleting, fields){
                    if(err){console.log(err);}
                    else{
                        conn.conn.query(sql6, pc_id, function(err, ajaxresult, fields){
                            res.json({"pc_like" : ajaxresult[0].pc_like, "button" : "Suka"});
                        });
                    }
                });    
            });
        }
        else{
            conn.conn.query(sql4, pc_id, function(err, update, fields){
                conn.conn.query(sql5, [pc_id, req.session.u_id, p_id], function(err, inserting, fields){
                    if(err){console.log(err);}
                    else{
                        conn.conn.query(sql6, pc_id, function(err, ajaxresult, fields){
                            res.json({"pc_like" : ajaxresult[0].pc_like, "button" : "Batal Suka"});
                        });
                    }
                });    
            });
        }
    });
    conn.conn.query(sql7, p_id, function(err, score, fields){
        if(err){console.log(err);}
    });
};
exports.warningPenobrol = function(req, res){
    var p_id = parseInt(req.body.warnedP);
    var pc_id = parseInt(req.body.warnedC);
    var pcc_id = parseInt(req.body.warnedCc);
    var sql = '';
    var checking_sql = 'select u_id, p_id, pc_id, pcc_id from warning WHERE u_id = ? AND p_id = ? AND pc_id = ? AND pcc_id = ?';
    conn.conn.query(checking_sql, [req.session.u_id, p_id, pc_id, pcc_id], function(err, checking, fields){
        if(err){console.log(err);}
        else{
            if(checking.length){
                res.json({"result":"alreadywarned"});
            }
            else{
                switch(req.body.warnedItem){
                    case "pen":
                        sql = 'INSERT INTO warning (u_id, p_id, pc_id, pcc_id) VALUES (?, ?, 0, 0)';
                        break;
                    case "com":
                        sql = 'INSERT INTO warning (u_id, p_id, pc_id, pcc_id) VALUES(?, ?, ?, 0)';
                        break;
                    case "pcc":
                        sql = 'INSERT INTO warning (u_id, p_id, pc_id, pcc_id) VALUES(?, ?, ?, ?)';
                }
                conn.conn.query(sql, [req.session.u_id, p_id, pc_id, pcc_id], function(err, warned, fields){
                    if(err){console.log(err);}
                    else{
                        res.json({"result":"warned"});
                    }
                });
                
            }
        }
    });
};

exports.getEditPenobrol = function(req, res){
    var p_id = req.params.penobrol_no;
    var sql = 'select * from penobrol where id = ?';
    var sql2 = 'select * from hashtag where p_id = ?';
    conn.conn.query(sql, p_id, function(err, edit, fields){
        if(err){console.log(err);}
        else{
            conn.conn.query(sql2, p_id, function(err, hashtags, fields){
                if(err){console.log(err);}
                else{
                    console.log(hashtags);
                    if(req.session.u_id == edit[0].author){
                        res.render('p-edit', {u_id:'y', edit_content:edit[0], hashtags:hashtags});
                    }
                    else{
                        res.redirect('/penobrol/'+p_id);
                    }
                }
            });
        }
    });
};

exports.postEditPenobrol = function(req, res){
    var title = req.body.title;
    var content = req.body.content;
    var rawhashtags = req.body.hashtag;
    var public = req.body.public;
    var hashtagCount = 0;
    var p_id = req.params.penobrol_no;
    while(rawhashtags.indexOf(' ')>=0){
        rawhashtags = rawhashtags.replace(' ', "");
    }
    var finalhashtag = rawhashtags.split('#');
    finalhashtag.splice(0,1);
    hashtagCount = finalhashtag.length;
    //for inserts
    var sql = 'UPDATE penobrol SET title = ?, content = ?, hashtagcount = ?, public = ? where id = ?';
    var sql4 = 'Delete from hashtag where p_id = ?';
    var sql5 = '';
    //for updates
    var sql2 = 'UPDATE penobrol set changed_date = now() WHERE id = ?';
    
    //update connection
    conn.conn.query(sql2, [p_id], function(err, update, fields){
        if(err){console.log(err);}
      });
    //insert connection
    conn.conn.query(sql, [title, content, hashtagCount, public, p_id], function(err, result, fields){
        if(err){console.log(err);}
        else{
            conn.conn.query(sql4, p_id, function(err, dhashtag, fields){
                if(err){console.log(err);}
                else{
                    sql5 = insertHashtagSqlMaker(p_id, finalhashtag);
                    conn.conn.query(sql5, function(err, hashtag, fields){
                        if(err){console.log(err);}
                        else{
                            res.redirect('/penobrol/'+p_id);
                        }
                    });
                }
            }); 
        }
    });
};

exports.getEditPcomment = function(req, res){
    var pc_id = req.params.pcomment_no;
    var p_id = req.params.penobrol_no;
    var sql = 'select * from p_com where id = ?';
    var sql2 = 'select * from penobrol where id = ?';
    var sql3 = 'select * from hashtag where p_id = ?';
    conn.conn.query(sql, pc_id, function(err, pcomment, fields){
        if(err){console.log(err);}
        else{
            conn.conn.query(sql2, p_id, function(err, penobrol, fields){
                if(err){console.log(err);}
                else{
                    conn.conn.query(sql3, p_id, function(err, hashtag, fields){
                        if(err){console.log(err);}
                        else{
                            if(req.session.u_id == pcomment[0].author){
                                res.render('pc-edit', {u_id:'y', topic:penobrol[0], edit_content:pcomment[0], hashtag:hashtag});
                            }
                            else{
                                res.redirect('/penobrol/'+p_id);
                            }
                        }
                    });
                }
            });
        }
    });
};

exports.postEditPcomment = function(req, res){
    var content = req.body.comment;
    var p_id = req.params.penobrol_no;
    var pc_id = req.params.pcomment_no;
    var sql = 'UPDATE p_com SET content = ?, changed_date = now() where id = ? AND p_id = ?';
    conn.conn.query(sql, [content, pc_id, p_id], function(err, updated, fields){
        if(err){console.log(err);}
        else{
            res.redirect('/penobrol/'+p_id);
        }
    });
};
