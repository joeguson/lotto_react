var conn = require('../../b');
var pool = require('../../b');
var nodemailer = require('nodemailer');
var key = require('../../info/beritamus-admin-2ff0df5d17ca.json');
var dbcon = require('../../db/dbconnection');

exports.checkUserId = function(req, res){
  var sql = 'SELECT COUNT(u_id) AS u_id from users WHERE u_id = ?';
  var u_id = req.body.u_id;
  var result = 0;
  conn.query(sql, u_id, function(err, check, fields){
    if(err){console.log(err);}
    else{
      if(parseInt(check[0].u_id) > 0){
        result = 1;
    }
      else{
        result = 0;
      }
      var responseData = {'result' : 'ok', 'u_id': result};
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
          if(users[0].verification === 1){
            if(users[0].u_id == u_id && users[0].u_pw == u_pw){ //아이디와 비밀번호가 맞다면
              conn.conn.query(sql3, [u_id], function(err, login, fields){ //update를 한 후에 정보를 넘김
                req.session.u_id = u_id;
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
    var totalt_like = [];
    var totalp_like = [];
    var totalta_like = [];
    var totalpc_like = [];

    var sql1 = 'SELECT * FROM users WHERE u_id= ?';
    var sql2 = 'SELECT * from penobrol WHERE author = ?';
    var sql3 = 'SELECT * from tandya WHERE author = ?';
    var sql4 = 'select count(p_id) as totalp_like from p_like where u_id = ?';
    var sql5 = 'select count(pc_id) as totalpc_like from pc_like where u_id = ?';
    var sql6 = 'select count(t_id) as totalt_like from t_like where u_id = ?';
    var sql7 = 'select count(ta_id) as totalta_like from ta_like where u_id = ?';

    async function getUserRecord(){
      userInfo = await dbcon.twoArg(sql1, req.session.u_id);
      userPenobrol = await dbcon.twoArg(sql2, userInfo[0].id);
      userTandya = await dbcon.twoArg(sql3, userInfo[0].id);
      totalp_like = await dbcon.twoArg(sql4, userInfo[0].id);
      totalpc_like = await dbcon.twoArg(sql5, userInfo[0].id);
      totalt_like = await dbcon.twoArg(sql6, userInfo[0].id);
      totalta_like = await dbcon.twoArg(sql7, userInfo[0].id);
      res.render('./ja/aku', {user:userInfo[0], penobrols:userPenobrol, tandyas:userTandya,
        p_like:totalp_like, t_like:totalt_like, pc_like:totalpc_like, ta_like:totalta_like});
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
      if(verify[0].vcode == code){
        sql2 = 'UPDATE users set verification = true, verify_date = NOW() where email = ?';
        conn.conn.query(sql2, email, function(err, verified, fields){
          if(err){console.log(err);}
          else{
            res.redirect('./ja/aku');
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
  var code = codeMaker();
  var sql2 = 'SELECT COUNT(u_id) AS u_id from users WHERE u_id = ?';
  var sql = 'INSERT INTO users (u_id, u_pw, u_bday, email, sex, vcode) VALUES (?, ?, ?, ?, ?, ?)';
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
      pass: 'TrueDream8783$$'          // gmail 계정의 비밀번호를 입력
    }
  });
  var mailOptions = {
    from: 'admin@beritamus.com',    // 발송 메일 주소 (위에서 작성한 gmail 계정 아이디)
    to: u_email,                     // 수신 메일 주소
    subject: 'Email Verikasi Dari Beritamus',   // 제목
    html: '<p>Welcome To Beritamus!</p>'+'<p>Selamat Datang!</p>'+'<p>Please click the url below</p>'+'<a href="http://beritamus.com/aku/daftar/auth/?email='+u_email+'&code='+code+'">Masuk Beritamus</a>'
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    }
  });
  res.redirect("'/aku'");
};

exports.getDaftar = function(req, res){
  res.render('./ja/user-add');
};
