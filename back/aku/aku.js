var conn = require('../../b');
var pool = require('../../b');
var nodemailer = require('nodemailer');
var key = require('../../info/beritamus-admin-2ff0df5d17ca.json');
var dbcon = require('../../db/dbconnection');
var parser = require('../../db/parser.js');
var jsForBack = require('../../back/jsForBack.js');
var db_config =require('../../config.json');

exports.getFindMyIdPw =function(req, res){
    res.render('./ja/findMyIdPw');
}

exports.checkUserId = function(req, res){
    var sql = "";
    if(req.body.type == 'id'){
        sql = 'SELECT COUNT(u_id) AS total from users WHERE u_id = ?';
    }else{
        sql = 'SELECT COUNT(email) AS total from users WHERE email = ?';
    }
    var result = 0;
    conn.conn.query(sql, req.body.data, function(err, check, fields){
        if(err){console.log(err);}
        else{
            if(parseInt(check[0].total) > 0){
                result = 1;
            }
            else{
                result = 0;
            }
            var responseData = {'result' : 'ok', 'length': result};
            res.json(responseData);
        }
    });
}

exports.login = function(req, res){
    //login이 이뤄질때
    var u_id = req.body.u_id;
    var u_pw = req.body.u_pw;
    var sql = 'SELECT * FROM users WHERE u_id = ?';
    var sql2 = 'SELECT COUNT(u_id) AS u_id from users WHERE u_id = ?';
    var sql3 = 'UPDATE users SET last_login = NOW() WHERE u_id = ?';
    conn.conn.query(sql2, [u_id], function(err, counts, fields){
        if(counts[0].u_id){ //만약 로그인 하려는 id가 있다면
            conn.conn.query(sql,[u_id], function(err, users, fields){ //회원의 모든 정보를 불러온다
                if(err){console.log(err);}
                else{
                    if(users[0].verify === 1){
                        if(users[0].u_id == u_id && users[0].u_pw == u_pw){ //아이디와 비밀번호가 맞다면
                            conn.conn.query(sql3, [u_id], function(err, login, fields){ //update를 한 후에 정보를 넘김
                                console.log(users);
                                req.session.u_id = u_id;
                                req.session.id2 = users[0].id;
                                req.session.save(function(){
                                    res.redirect('/aku');
                                });
                            });
                        }
                        else{
                        res.render('./ja/aku', {"message":"tolong cek Password Anda"});
                        }
                    }
                    else{
                        res.render('./ja/aku', {"message":"email Anda belum diverifikasi"});
                    }
                }
            });
        }
        else{//만약 로그인 하려는 id가 없다면
            res.render('./ja/aku', {"message":"ID ini tidak ada"});
        }
    });
};

exports.welcome = function(req, res){
  if(req.session.u_id){
    var userInfo = [];
    var userPenobrol = [];
    var userTandya = [];
    var totalLikes = {
        "penobrol" : 0,
        "tandya" : 0,
        "comment" : 0,
        "answer" : 0
    };

    var sql1 = 'SELECT * FROM users WHERE u_id= ?';
    var sql2 = 'SELECT * from penobrol WHERE author = ?  ORDER BY date DESC';
    var sql3 = 'SELECT * from tandya  WHERE author = ? ORDER BY date DESC';
    var sql4 = 'select count(p_id) as count from p_com where p_id = ?';
    var sql5 = 'select count(t_id) as count from t_ans where t_id = ?';
    var sql6 = 'SELECT * FROM penobrol_hashtag where p_id = ?';
    var sql7 = 'SELECT * FROM tandya_hashtag where t_id = ?';
    var sql8 = 'select count(p_id) as count from p_like where p_id = ?';
    var sql9 = 'select count(t_id) as count from t_like where t_id = ?';
    var sql10 = 'select count(c.p_id) as total from(select p.id, p.author, pl.p_id from penobrol as p inner join p_like as pl on p.id = pl.p_id where p.author = ?) as c';
    var sql11 = 'select count(c.t_id) as total from(select t.id, t.author, tl.t_id from tandya as t inner join t_like as tl on t.id = tl.t_id where t.author = ?) as c';
    var sql12 = 'select count(c.pc_id) as total from(select p.id, p.author, pl.pc_id from p_com as p inner join pc_like as pl on p.id = pl.pc_id where p.author = ?) as c';
    var sql13 = 'select count(c.ta_id) as total from(select t.id, t.author, tl.ta_id from t_ans as t inner join ta_like as tl on t.id = tl.ta_id where t.author = ?) as c';

    async function getUserRecord(){
        userInfo = await dbcon.twoArg(sql1, req.session.u_id);
        userPenobrol = (await dbcon.twoArg(sql2, userInfo[0].id)).map(parser.parseFrontPenobrol);
        userTandya = (await dbcon.twoArg(sql3, userInfo[0].id)).map(parser.parseFrontTandya);
        for(var i = 0; i<userPenobrol.length;i++){
            userPenobrol[i].commentCount = (await dbcon.twoArg(sql4, userPenobrol[i].id))[0].count;
            userPenobrol[i].hashtags = (await dbcon.twoArg(sql6, userPenobrol[i].id)).map(parser.parseHashtagP);
            userPenobrol[i].likeCount = (await dbcon.twoArg(sql8, userPenobrol[i].id))[0].count;
        }
        for(var j = 0; j<userTandya.length;j++){
            userTandya[j].answerCount = (await dbcon.twoArg(sql5, userTandya[j].id))[0].count;
            userTandya[j].hashtags = (await dbcon.twoArg(sql7, userTandya[j].id)).map(parser.parseHashtagT);
            userTandya[j].likeCount = (await dbcon.twoArg(sql9, userTandya[j].id))[0].count;
        }
        totalLikes.penobrol = (await dbcon.twoArg(sql10, userInfo[0].id))[0].total;
        totalLikes.tandya = (await dbcon.twoArg(sql11, userInfo[0].id))[0].total;
        totalLikes.comment = (await dbcon.twoArg(sql12, userInfo[0].id))[0].total;
        totalLikes.answer = (await dbcon.twoArg(sql13, userInfo[0].id))[0].total;
        res.render('./ja/aku', {user:userInfo[0], penobrols:userPenobrol, tandyas:userTandya, totalLikes:totalLikes});
    }
    getUserRecord();
  }
  else{
    res.render('./ja/aku');
  }
};

exports.hilang = function(req, res){
    res.redirect('/aku');
};

exports.getDaftarAuth = function(req, res){
    var email = req.query.email;
    var code = req.query.code;
    var sql = 'SELECT * FROM users WHERE email = ?';
    var sql2 = '';
    conn.conn.query(sql, email, function(err, verify, fields){
        if(verify[0]){
            if(verify[0].verify == code){
                sql2 = 'UPDATE users set verify = 1, verify_date = NOW() where email = ?';
                conn.conn.query(sql2, email, function(err, verified, fields){
                    if(err){console.log(err);}
                    else{
                        res.render('./ja/aku');
                    }
                });
            }
            else{
                res.render('./ja/aku', {"message":"your verification code is wrong"});
            }
        }
        else{
            res.render('./ja/aku', {"message":"wrong approach"});
        }
    });
};

exports.logout = function(req, res){
  delete req.session.u_id;
  req.session.save(function(){
    res.redirect('/aku');
  });
};

exports.postDaftar = function(req, res){
  var u_id = req.body.u_id;
  var u_pw = req.body.u_pw;
  var birthday = req.body.birthday;
  var u_sex = req.body.gender;
  var u_email = req.body.email;
  var code = parseInt(jsForBack.codeMaker());
  console.log(code);
  console.log(typeof(code));
  var sql2 = 'SELECT COUNT(u_id) AS u_id from users WHERE u_id = ?';
  var sql = 'INSERT INTO users (u_id, u_pw, u_bday, email, sex, verify) VALUES (?, ?, ?, ?, ?, ?)';
  conn.conn.query(sql2, [u_id], function(err, check, fields){
    if(err){console.log(err);}
    else{
        if(check[0].u_id){
        }
        else{
             conn.conn.query(sql, [u_id, u_pw, birthday, u_email, u_sex, code], function(err, result, fields){
                if(err){console.log(err);}
            });
        }
    }
  });
  var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      type: 'OAuth2',
      user: 'admin@beritamus.com',  // gmail 계정 아이디를 입력
      serviceClient: key.client_id,
      privateKey: key.private_key,
      pass: 'GoBeritamus$$'          // gmail 계정의 비밀번호를 입력
    }
  });
  var mailOptions = {
    from: 'admin@beritamus.com',    // 발송 메일 주소 (위에서 작성한 gmail 계정 아이디)
    to: u_email,                     // 수신 메일 주소
    subject: 'Email Verikasi Dari Beritamus',   // 제목
    html: '<p>Welcome To Beritamus!</p>'+'<p>Selamat Datang!</p>'+'<p>Please click the url below</p>'+'<a href="http://'+db_config.url+'/aku/daftar/auth/?email='+u_email+'&code='+code+'">Masuk Beritamus</a>'
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    }
  });
  res.redirect('/aku');
};

exports.getDaftar = function(req, res){
  res.render('./ja/user-add');
};
