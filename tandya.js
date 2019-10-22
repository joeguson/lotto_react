var conn = require('./b-test');

/************FOR TANDYA************/
exports.getTandya = function(req, res){
    var sql = 'select * from tandya order by date desc limit 3';
    var sql2 = 'SELECT * FROM tandya ORDER BY score DESC limit 3';
    if(req.session.u_id){
        conn.conn.query(sql, function(err, dateOrder, fields){
            //conn.conn.query(sql2, function(err, scoreOrder, fields){});
            res.render('t', {topics:dateOrder, u_id:'y'});
        });
    }
    else{
        conn.conn.query(sql, function(err, dateOrder, fields){
            //conn.conn.query(sql2, function(err, scoreOrder, fields){});
            res.render('t', {topics:dateOrder});
      });
    }
};
exports.getViewTandya =  function(req, res){
    var id = req.params.tandya_no;
    var sql1 = 'SELECT MAX(id) AS max from tandya';
    var sql3 = 'UPDATE tandya SET t_view = t_view + 1 WHERE id = ?';
    var sql7 = 'UPDATE tandya SET score = t_view*.2 + t_like*.5 + answer*0.3 where id = ?';
    
    var sql = 'SELECT * FROM tandya WHERE id = ?';
    var sql2 = 'SELECT * FROM t_ans WHERE t_id = ? order by score desc';
    var sql6 = 'SELECT * FROM hashtag where t_id = ?';
    var sql4 = 'Select * from t_like where u_id = ? AND t_id = ?';
    
        
    conn.conn.query(sql1, function(err, maxValue, fields){
        if(maxValue[0].max < id){
            res.send('/tandya/belumadakonten'); //change to redirect and make a file
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
                                    if(content[0].public != 'p'){
                                        var idChanger = '';
                                        var idLength  = (content[0].author).length;
                                        console.log(idLength);
                                        idChanger = content[0].author.substr(0,3) + '****';
                                        content[0].author = idChanger;
                                    }
                                    delete hashtag[0].id;
                                    delete hashtag[0].u_id;
                                    delete hashtag[0].p_id;
                                    delete hashtag[0].t_id;
                                    if(req.session.u_id){
                                        conn.conn.query(sql4, [req.session.u_id, id], function(err, likeStatus, fileds){
                                            var statusCheck = 'liked';
                                            if(likeStatus === null){
                                                statusCheck = 'yes';
                                            }
                                            else{
                                                statusCheck = 'no';
                                            }
                                            console.log(statusCheck);
                                            res.render('t-view', {topic:content[0], statusCheck:statusCheck, answers:answers, u_id:'y', hashtag:hashtag[0]});
                                        });
                                    }
                                    else{
                                        res.render('t-view', {topic:content[0], answers:answers, hashtag:hashtag[0]});
                                        console.log(hashtag[0]);
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

exports.getAddTandya = function(req, res){
  if(req.session.u_id){
        res.render('t-add', {u_id:'y'});
    }
    else{
        res.send('/tandya/belumadakonten'); //change to redirect and make a file
    }
};
exports.postAddTandya = function(req, res){
    var author = req.session.u_id;
    var content = req.body.content;
    var question = req.body.question;
    var hashtags = req.body.hashtag;
    var hashtagCount = 0;
    var public = req.body.public;
    while(hashtags.indexOf(' ')>=0){
        hashtags.replace(' ', '');
    }
    var hashtag = hashtags.split('#');
    hashtagCount = hashtag.length;
    var perfecthashtag = function (array){
        array.splice(0, 1);
        if(array.length > 7){
            while(array.length > 7){
                array.splice(7, 1);
            }
        }
        else if(array.length < 7){
            while(array.length < 7){
                array.push('DEFAULT');
            }  
        }
        return array;
    };
    var finalhastag = perfecthashtag(hashtag);
    var sql = 'INSERT INTO tandya (author, question, content, hashtagcount, public) VALUES (?, ?, ?, ?, ?)';
    var sql4 = 'INSERT INTO hashtag (t_id, u_id, ht1, ht2, ht3, ht4, ht5, ht6, ht7) VALUES (?, ?, ?);';
    var sql2 = 'UPDATE users set u_tan = u_tan + 1 WHERE u_id = ?';
    var sql3 = 'UPDATE overview SET total_t = total_t +1 WHERE id = 1';
    //update connection
    conn.conn.query(sql3, function(err, update, fields){
        if(err){console.log(err);}
    });
    conn.conn.query(sql2, [author], function(err, update, fields){
        if(err){console.log(err);}
      });
    //insert connection
    conn.conn.query(sql, [author, question, content, hashtagCount, public], function(err, result, fields){
          if(err){console.log(err);}
          else{
            conn.conn.query(sql4, [result.insertId, author, finalhastag], function(err, hashtag, fields){
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
    var sql3 = 'UPDATE tandya SET score = t_view*.2 + t_like*.5 + answer*0.3 where id = ?';
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

exports.likesTandya = function(req, res){
    var clickValue = req.body.clickedValue;
    var t_id = req.params.id;
    var sql = 'SELECT * FROM t_like WHERE u_id = ? AND t_id = ?';
    var sql2 = 'UPDATE tandya set t_like = t_like - 1 where id = ?';
    var sql3 = 'DELETE FROM t_like WHERE u_id = ? AND t_id = ?';
    var sql4 = 'UPDATE tandya set t_like = t_like + 1 where id = ?';
    var sql5 = 'INSERT INTO t_like (t_id, u_id) VALUES (?, ?)';
    var sql6 = 'select t_like from tandya where id = ?';
    var sql7 = 'UPDATE tandya SET score = t_view*.2 + t_like*.6 + answer*0.2 where id = ?';
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
    var t_id = req.params.id;
    var sql = 'SELECT * FROM ta_like WHERE u_id = ? AND ta_id = ?';
    var sql2 = 'UPDATE t_ans set ta_like = ta_like - 1 where id = ?';
    var sql3 = 'DELETE FROM ta_like WHERE u_id = ? AND ta_id = ?';
    var sql4 = 'UPDATE t_ans set ta_like = ta_like + 1 where id = ?';
    var sql5 = 'INSERT INTO ta_like (ta_id, u_id) VALUES (?, ?)';
    var sql6 = 'select ta_like from t_ans where id = ?';
    var sql7 = 'UPDATE tandya SET score = t_view*.2 + t_like*.6 + answer*0.2 where id = ?';
    conn.conn.query(sql, [req.session.u_id, t_id], function(err, statusCheck, fields){
        if(clickValue == 'Batal Suka'){
            conn.conn.query(sql2, t_id, function(err, update, fields){
                conn.conn.query(sql3, [req.session.u_id, t_id], function(err, deleting, fields){
                    if(err){console.log(err);}
                    else{
                        conn.conn.query(sql6, t_id, function(err, ajaxresult, fields){
                            res.json({"ta_like" : ajaxresult[0].ta_like, "button" : "Suka"});
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