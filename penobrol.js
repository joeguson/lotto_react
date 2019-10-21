var conn = require('./b-test');

/************FOR PENOBROL************/
exports.getPenobrol = function(req, res){
    var sql = 'SELECT * from penobrol order by date desc limit 3';
    var sql2 = 'SELECT * FROM penobrol ORDER BY score DESC limit 3';
    if(req.session.u_id){
        conn.conn.query(sql, function(err, dateOrder, fields){
            //conn.conn.query(sql2, function(err, scoreOrder, fields){});
            res.render('p', {topics:dateOrder, u_id:'y'});
        });
    }
    else{
        conn.conn.query(sql, function(err, dateOrder, fields){
            //conn.conn.query(sql2, function(err, scoreOrder, fields){});
            res.render('p', {topics:dateOrder});
      });
    }
};

exports.getViewPenobrol = function(req, res){
    var id = req.params.penobrol_no;
    var sql1 = 'SELECT MAX(id) AS max from penobrol';
    var sql3 = 'UPDATE penobrol SET p_view = p_view + 1 WHERE id = ?';
    var sql5 = 'UPDATE penobrol SET score = p_view*.2 + p_like*.6 + com*0.2 where id = ?';

    var sql = 'SELECT * FROM penobrol WHERE id = ?';
    var sql2 = 'SELECT * FROM p_com WHERE p_id = ?';
    var sql6 = 'SELECT * FROM hashtag where p_id = ?';
    var sql4 = 'SELECT * FROM p_like WHERE u_id = ? AND p_id = ?';
    var sql7 = 'SELECT * FROM pc_com WHERE p_id = ?';
    
    conn.conn.query(sql1, function(err, maxValue, fields){
        if(maxValue[0].max < id){
            res.send('/penobrol/belumadakonten'); //change to redirect and make a file
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
                                if(content[0].public != 'p'){
                                    var idChanger = '';
                                    var idLength = (content[0].author).length;
                                    console.log(idLength);
                                    idChanger = content[0].author.substr(0,3) + '****';
                                    content[0].author = idChanger;
                                }
                                delete hashtag[0].id;
                                delete hashtag[0].u_id;
                                delete hashtag[0].p_id;
                                delete hashtag[0].t_id;
                                if(req.session.u_id){
                                    console.log(ccomments);
                                    console.log(ccomments[0]);
                                    console.log(ccomments[1].id);
                                    conn.conn.query(sql4, [req.session.u_id, id], function(err, likeStatus, fields){
                                        var statusCheck = 'liked';
                                        if(likeStatus === null){
                                            statusCheck = 'yes';
                                        }
                                        else{
                                            statusCheck = 'no';
                                        }
                                        res.render('p-view', {topic:content[0], statusCheck:statusCheck, comments:comments, u_id:'y', hashtag:hashtag[0], ccomments:ccomments});
                                    });
                                }
                                else{
                                    res.render('p-view', {topic:content[0], comments:comments, hashtag:hashtag[0], ccomments:ccomments});
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
};

exports.getAddPenobrol = function(req, res){
    if(req.session.u_id){
        res.render('p-add', {u_id:'y'});
    }
    else{
        res.send('/penobrol/belumadakonten'); //change to redirect and make a file
    }
};
exports.postAddPenobrol = function(req, res){
    var author = req.session.u_id;
    var content = req.body.content;
    var title = req.body.title;
    var rawhashtags = req.body.hashtag;
    var public = req.body.public;
    var hashtagCount = 0;
    while(rawhashtags.indexOf(' ')>=0){
        rawhashtags = rawhashtags.replace(' ', "");
    }
    var hashtags = rawhashtags.split('#');
    hashtagCount = hashtags.length;
    var perfecthashtag = function (array){
        array.splice(0, 1);
        if(array.length > 7){
            while(array.length > 7){
                array.splice(7, 1);
            }
        }
        else if(array.length < 7){
            while(array.length < 7){
                array.push(' ');
            }  
        }
        return array;
    };
    var finalhastag = perfecthashtag(hashtags);
    //for inserts
    var sql = 'INSERT INTO penobrol (author, title, content, hashtagcount, public) VALUES (?, ?, ?, ?, ?)';
    var sql4 = 'INSERT INTO hashtag (p_id, u_id, ht1, ht2, ht3, ht4, ht5, ht6, ht7) VALUES (?, ?, ?);';
    //for updates
    var sql2 = 'UPDATE users set u_pen= u_pen + 1 WHERE u_id = ?';
    var sql3 = 'UPDATE overview SET total_p = total_p +1 WHERE id = 1';
    
    //update connection
    conn.conn.query(sql3, function(err, update, fields){
        if(err){console.log(err);}
    });
    conn.conn.query(sql2, [author], function(err, update, fields){
        if(err){console.log(err);}
      });
    //insert connection
    conn.conn.query(sql, [author, title, content, hashtagCount, public], function(err, result, fields){
        if(err){console.log(err);}
        else{
            conn.conn.query(sql4, [result.insertId, author, finalhastag], function(err, hashtag, fields){
                if(err){console.log(err);}
                else{
                    res.redirect('/penobrol/'+result.insertId);
                }
            }); 
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
    console.log('ajax is in');
    var sql = 'INSERT INTO pc_com (author, content, pc_id, p_id) VALUES (?, ?, ?, ?)';
    var sql2 = 'UPDATE p_com SET com = com + 1 WHERE id = ?';
    var sql3 = 'UPDATE p_com SET score = pc_like*0.6 + com*0.4 where id = ?';
    var sql4 = 'SELECT * FROM pc_com where id = ?';
    conn.conn.query(sql, [author, content, pc_id, p_id], function(err, result, fields){
        if(err){console.log(err);}
        else{
            conn.conn.query(sql2, [pc_id], function(err, result2, fields){
                if(err){console.log(err)}
                else{
                    conn.conn.query(sql3, pc_id, function(err, result3, fields){
                        if(err){console.log(err)}
                        else{
                            conn.conn.query(sql4, result.insertId, function(err, ajaxResult, fields){
                                res.json({"ccomment_id" : ajaxResult[0].id, "ccomment_author" : ajaxResult[0].author, "ccomment_content" : ajaxResult[0].content});
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
    var sql3 = 'DELETE FROM p_like WHERE u_id = ? AND p_id = ?';
    var sql4 = 'UPDATE penobrol set p_like = p_like + 1 where id = ?';
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
};

exports.likesComment = function(req, res){
    var clickValue = req.body.clickedValue;
    var p_id = req.params.id;
    var sql = 'SELECT * FROM pc_like WHERE u_id = ? AND pc_id = ?';
    var sql2 = 'UPDATE p_com set pc_like = pc_like - 1 where id = ?';
    var sql3 = 'DELETE FROM pc_like WHERE u_id = ? AND pc_id = ?';
    var sql4 = 'UPDATE p_com set pc_like = pc_like + 1 where id = ?';
    var sql5 = 'INSERT INTO pc_like (pc_id, u_id) VALUES (?, ?)';
    var sql6 = 'select pc_like from p_com where id = ?';
    var sql7 = 'UPDATE p_com SET score = pc_like*.6 + com*0.4 where id = ?';
    conn.conn.query(sql, [req.session.u_id, p_id], function(err, statusCheck, fields){
        if(clickValue == 'Batal Suka'){
            conn.conn.query(sql2, p_id, function(err, update, fields){
                conn.conn.query(sql3, [req.session.u_id, p_id], function(err, deleting, fields){
                    if(err){console.log(err);}
                    else{
                        conn.conn.query(sql6, p_id, function(err, ajaxresult, fields){
                            res.json({"pc_like" : ajaxresult[0].pc_like, "button" : "Suka"});
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
                            res.json({"pc_like" : ajaxresult[0].pc_like, "button" : "Batal Suka"});
                        });
                    }
                });    
            });
        }
    });   
};