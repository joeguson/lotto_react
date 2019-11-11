var conn = require('./b');
var nodemailer = require('nodemailer');
var key = require('./beritamus-admin-2ff0df5d17ca.json');

function codeMaker(){
    var ar = [];
    var final_code = '';
    var temp;
    var rnum;
    for(var j=1; j<=9; j++){ar.push(j);}
    for(var i=0; i< ar.length ; i++)
    {
        rnum = Math.floor(Math.random() *9); //난수발생
        temp = String(ar[i]); 
        ar[i] = String(ar[rnum]);
        ar[rnum] = temp;
    }
    final_code = ar[0]+ar[1]+ar[2]+ar[3]+ar[4]+ar[5];
    return final_code;
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
                            res.render('aku', {"message":"tolong cek Password Anda"});
                        }
                    }
                    else{
                        res.render('aku', {"message":"email Anda belum diverifikasi"});
                    }
                }
            });
        }
        else{//만약 로그인 하려는 id가 없다면
            res.render('aku', {"message":"ID ini tidak ada"});
        }
    });
};

exports.welcome = function(req, res){
    if(req.session.u_id){
        var sql = 'SELECT * FROM users WHERE u_id= ?';
        var sql2 = 'SELECT * from penobrol WHERE author = ?';
        var sql3 = 'SELECT * from tandya WHERE author = ?';
        var sql4 = 'select author, sum(t_like) as totalt_like from tandya where author = ?';
        var sql5 = 'select author, sum(p_like) as totalp_like from penobrol where author = ?';
        var sql6 = 'select author, sum(ta_like) as totalta_like from t_ans where author = ?';
        var sql7 = 'select author, sum(pc_like) as totalpc_like from p_com where author = ?';
         conn.conn.query(sql, [req.session.u_id], function(err, user, fields){
             conn.conn.query(sql2, [req.session.u_id], function(err, penobrols, fields){
                if(err){console.log(err);}
                else{
                    conn.conn.query(sql3, [req.session.u_id], function(err, tandyas, fields){
                        if(err){console.log(err);}
                        else{
                            conn.conn.query(sql4, [req.session.u_id], function(err, t_like, fields){
                                if(err){console.log(err);}
                                else{
                                    conn.conn.query(sql5, [req.session.u_id], function(err, p_like, fields){
                                        if(err){console.log(err);}
                                        else{
                                            conn.conn.query(sql6, [req.session.u_id], function(err, ta_like, fields){
                                                if(err){console.log(err);}
                                                else{
                                                    conn.conn.query(sql7, [req.session.u_id], function(err, pc_like, fields){
                                                        res.render('aku', {user:user[0], penobrols:penobrols, tandyas:tandyas, totalt_like:t_like[0], totalp_like:p_like[0], totalta_like:ta_like[0], totalpc_like:pc_like[0]});
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
            }); 
        });
    }
    else{
        //make contoh with your admin account and then spread!
        res.render('aku');
    }
};

exports.hilang = function(req, res){
    res.send('please prepare');
};

exports.getDaftarAuth = function(req, res){
    var email = req.query.email;
    var code = req.query.code;
    var sql = 'SELECT * FROM users WHERE email = ?';
    var sql2 = '';
    conn.conn.query(sql, email, function(err, verify, fields){
        if(verify[0]){
            if(verify[0].vcode == code){
                sql2 = 'UPDATE users set verification = true where email = ?';
                conn.conn.query(sql2, email, function(err, verified, fields){
                    if(err){console.log(err);}
                    else{
                        res.redirect('/aku');
                    }
                });
            }
            else{
                res.render('aku', {"message":"your verification code is wrong"});
            }
        }   
        else{
            res.render('aku', {"message":"wrong approach"});
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
        html: '<p>Welcome To Beritamus!</p>'+'<p>Selamat Datang!</p>'+'<p>Please click the url below</p>'+'<a href="http://beritamus.com/daftar/auth/?email='+u_email+'&code='+code+'">Masuk Beritamus</a>'
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        }
    });
    res.redirect("/");
};

exports.getDaftar = function(req, res){
  res.render('user-add');
};

