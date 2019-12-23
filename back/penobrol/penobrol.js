var conn = require('../../b');
var pool = require('../../b');
var dbcon = require('../../db/dbconnection');
var jsForBack = require('../jsForBack');

/************FOR PENOBROL************/
exports.getPenobrol = function(req, res){
  var sql1 = 'select p.*, u.u_id from penobrol as p join users as u on p.author = u.id order by date desc limit 3';
  var sql2 = 'select p.*, u.u_id from penobrol as p join users as u on p.author = u.id ORDER BY score DESC limit 3';
  var sql3 = 'select * from penobrol_hashtag where p_id = ?';
  var sql4 = 'select * from penobrol_hashtag where p_id = ?';

  var byDate = [];
  var byScore = [];
  var pHashtag = [];

  async function getOrderedP(){
    byDate = await dbcon.oneArg(sql1);
    byScore = await dbcon.oneArg(sql2);
    for(var i=0;i<byDate.length;i++){
      pHashtag.push(await dbcon.twoArg(sql3, byDate[i].id));
    }
    for(var j=0;j<byScore.length;j++){
      pHashtag.push(await dbcon.twoArg(sql4, byScore[j].id));
    }
    pHashtag = jsForBack.remove_duplicates(pHashtag);
    if(req.session.u_id){
      res.render('./jp/p', {dateTopics:byDate, scoreTopics:byScore, hashtags:pHashtag, u_id:req.session.u_id});
    }
    else{
      res.render('./jp/p', {dateTopics:byDate, scoreTopics:byScore, hashtags:pHashtag});
    }
  }
  getOrderedP();
};

exports.getViewPenobrol = function(req, res){
  var id = req.params.penobrol_no;
  var penobrol = [];
  var p_comments = [];
  var p_hashtags = [];
  var pc_comments = [];
  var p_likes = [];
  var pc_likes = [];
  var checkId = /^[0-9]+$/;
  if(checkId.test(id)){
    var sql1 = 'SELECT MAX(id) AS max from penobrol';
    conn.conn.query(sql1, function(err, maxValue, fields){
      if(err){console.log(err);}
      else if(maxValue[0].max < id){
        res.redirect('/penobrol/'); //change to redirect and make a file
      }
      else{
        async function getP(){
          var sql2 = 'UPDATE penobrol SET p_view = p_view + 1 WHERE id = ?';
          var sql3 = 'UPDATE penobrol SET score = ((select count(p_id) from p_com where p_id = ?) *.3 + (select count(p_id) from p_like where p_id = ?)*.7)/p_view * 100 where id = ?';
          var sql4 = 'select p.*, u.u_id from penobrol as p join users as u on p.author = u.id where p.id = ?';
          var sql5 = 'SELECT p.*, u.u_id FROM p_com as p join users as u on p.author = u.id WHERE p_id = ? order by score desc';
          var sql6 = 'SELECT * FROM penobrol_hashtag where p_id = ?';
          var sql7 = 'SELECT p.*, u.u_id FROM pc_com as p join users as u on p.author = u.id WHERE p.pc_id = ?';
          var sql8 = 'SELECT p.p_id as like_id, p.u_id, u.u_id FROM p_like as p join users as u on p.u_id = u.id WHERE p.p_id = ?';
          var sql9 = 'SELECT p.pc_id as like_id, p.u_id, u.u_id FROM pc_like as p join users as u on p.u_id = u.id where p.pc_id = ?';
          await dbcon.twoArg(sql2, id);
          await dbcon.fourArg(sql3, id, id, id);
          penobrol = await dbcon.twoArg(sql4, id);
          p_comments = await dbcon.twoArg(sql5, id);
          p_hashtags = await dbcon.twoArg(sql6, id);
          if(p_comments.length>0){
            for(var i=0;i<p_comments.length;i++){
              pc_comments.push(await dbcon.twoArg(sql7, p_comments[i].id));
            }
          }
          p_likes = await dbcon.twoArg(sql8, id);
          if(p_comments.length>0){
            for(var j=0;j<p_comments.length;j++){
              pc_likes.push(await dbcon.twoArg(sql9, p_comments[j].id));
            }
          }
          if(req.session.u_id){
            res.render('./jp/p-view', {topic:penobrol[0], comments:p_comments, u_id:req.session.u_id, hashtag:p_hashtags, ccomments:pc_comments, plikes:p_likes, pclikes:pc_likes});
          }
          else{
            res.render('./jp/p-view', {topic:penobrol[0], comments:p_comments, hashtag:p_hashtags, ccomments:pc_comments, plikes:p_likes, pclikes:pc_likes});
          }
        }
        getP();
      }
    });
  }
  else{
    res.redirect('/penobrol/');
  }
};

exports.getAddPenobrol = function(req, res){
  if(req.session.u_id){
    res.render('./jp/p-add', {u_id:'y'});
  }
  else{
    res.redirect('/penobrol/');
  }
};
exports.postAddPenobrol = function(req, res){
  var author = req.session.u_id;
  var content = req.body.content;
  var title = req.body.title;
  var rawhashtags = req.body.hashtag;
  var public = req.body.public;
  var finalhashtag = jsForBack.finalHashtagMaker(rawhashtags);

  var sql = "INSERT INTO penobrol (author, title, content, public) VALUES ((select id from users where u_id = ?), ?, ?, ?)";
  var sql2 = "INSERT INTO penobrol_hashtag (p_id, hash) VALUES (?, ?)";

  async function insertHashtag(query, id, hashtagArray){
    for(var i=0;i<hashtagArray.length;i++){
      await dbcon.threeArg(query, id, hashtagArray[i]);
    }
    res.redirect('/penobrol/'+id);
  }
  conn.conn.query(sql, [author, title, content, public], function(err, result, fields){
    if(err){console.log(err);}
    else{
      insertHashtag(sql2, result.insertId, finalhashtag);
    }
  });
};

exports.postAddComment = function(req, res){
  var author = req.session.u_id;
  var content = req.body.comment;
  var p_id = req.params.penobrol_no;
  //when connection is more than two, divide
  var sql1 = 'INSERT INTO p_com (author, content, p_id) VALUES ((select id from users where u_id = ?), ?, ?)';
  var sql2 = 'UPDATE penobrol SET score = ((select count(p_id) from p_com where p_id = ?) *.3 + (select count(p_id) from p_like where p_id = ?)*.7)/p_view * 100 where id = ?'
  conn.conn.query(sql1, [author, content, p_id], function(err, result, fields){
    if(err){console.log(err);}
    else{
      conn.conn.query(sql2, [p_id, p_id, p_id], function(err, result2, fields){
        if(err){console.log(err);}
        else{
          res.redirect('/penobrol/'+p_id);
        }
      });
    }
  });
};

exports.postAddCcomment = function(req, res){
  var author = req.session.u_id;
  var content = req.body.ccommentContent;
  var p_id = req.params.p_id;
  var pc_id = req.params.pc_id;
  //when connection is more than two, divide
  var sql1 = 'UPDATE p_com set score = ((select count(pc_id) from pc_com where pc_id = ?) *.3 + (select count(pc_id) from pc_like where pc_id = ?)*.7)/(select p_view from penobrol where id = ?) * 100 where id = ?';
  var sql2 = 'INSERT INTO pc_com (author, content, pc_id) VALUES ((select id from users where u_id = ?), ?, ?)';
  var sql3 = 'SELECT p.*, u.u_id FROM pc_com as p join users as u on p.author = u.id where p.id = ?';

  conn.conn.query(sql1, [pc_id, pc_id, p_id, pc_id], function(err, result, fields){
    if(err){console.log(err);}
    else{
      conn.conn.query(sql2, [author, content, pc_id], function(err, result2, fields){
        if(err){console.log(err);}
        else{
          conn.conn.query(sql3, result2.insertId, function(err, ajaxResult, fields){
            res.json({"ccomment_id" : ajaxResult[0].id, "ccomment_author" : ajaxResult[0].u_id, "ccomment_content" : ajaxResult[0].content, "ccomment_date" : ajaxResult[0].date});
          });
        }
      });
    }
  });
};

exports.likesPenobrol = function(req, res){
  var clickValue = req.body.clickedValue;
  var p_id = req.params.id;
  var sql1 = '';
  var sql2 = 'UPDATE penobrol SET score = ((select count(p_id) from p_com where p_id = ?) *.3 + (select count(p_id) from p_like where p_id = ?)*.7)/p_view * 100 where id = ?'
  var sql3 = 'select count(p_id) as plikeCount from p_like where p_id = ?';
  var buttonValue = '';
  if(clickValue == 'Batal Suka'){
    sql1 = 'DELETE FROM p_like WHERE p_id = ? AND u_id = (select id from users where u_id = ?)';
    buttonValue = "Suka";
  }
  else{
    sql1 = 'INSERT INTO p_like (p_id, u_id) VALUES (?, (select id from users where u_id = ?))';
    buttonValue = "Batal Suka";
  }
  conn.conn.query(sql1, [p_id, req.session.u_id], function(err, action, fields){
    if(err){console.log(err);}
    else{
      conn.conn.query(sql2, [p_id, p_id, p_id], function(err, update, fields){
        if(err){console.log(err);}
        else{
          conn.conn.query(sql3, p_id, function(err, ajaxResult, fields){
            console.log(ajaxResult);
            res.json({"p_like" : ajaxResult[0].plikeCount, "button" : buttonValue});
          });
        }
      });
    }
  });
};

exports.likesComment = function(req, res){
  var clickValue = req.body.clickedValue;
  var p_id = req.body.p_id;
  var pc_id = req.body.pc_id;

  var sql1 = '';
  var sql2 = 'UPDATE p_com set score = ((select count(pc_id) from pc_com where pc_id = ?) *.3 + (select count(pc_id) from pc_like where pc_id = ?)*.7)/(select p_view from penobrol where id = ?) * 100 where id = ?';
  var sql3 = 'select count(pc_id) as pcLikeCount from pc_like where pc_id = ?';
  var buttonValue = '';
  if(clickValue == 'Batal Suka'){
    sql1 = 'DELETE FROM pc_like WHERE pc_id = ? AND u_id = (select id from users where u_id = ?)';
    buttonValue = 'Suka';
  }
  else{
    sql1 = 'INSERT INTO pc_like (pc_id, u_id) VALUES (?, (select id from users where u_id = ?))';
    buttonValue = 'Batal Suka';
  }

  conn.conn.query(sql1, [pc_id, req.session.u_id], function(err, action, fields){
    if(err){console.log(err);}
    else{
      conn.conn.query(sql2, [pc_id, pc_id, p_id, pc_id], function(err, update, fields){
        if(err){console.log(err);}
        else{
          conn.conn.query(sql3, pc_id, function(err, ajaxresult, fields){
            res.json({"pc_like" : ajaxresult[0].pcLikeCount, "button" : buttonValue});
          });
        }
      });
    }
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
                      res.render('./jp/p-edit', {u_id:'y', edit_content:edit[0], hashtags:hashtags});
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
                              res.render('./jp/pc-edit', {u_id:'y', topic:penobrol[0], edit_content:pcomment[0], hashtag:hashtag});
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
