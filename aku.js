var conn = require('./b-test');
exports.login = function(req, res){
    //login이 이뤄질때
    var u_id = req.body.u_id;
    var u_pw = req.body.u_pw;
    var sql = 'SELECT * FROM users WHERE u_id = ?';
    var sql2 = 'SELECT COUNT(u_id) AS u_id from users WHERE u_id = ?';
    var sql3 = 'UPDATE users SET last_login = NOW(), u_haipur = u_haipur+100 WHERE u_id = ?';
    conn.conn.query(sql2, [u_id], function(err, counts, fields){
        if(counts[0].u_id){ //만약 로그인 하려는 id가 있다면
             conn.conn.query(sql,[u_id], function(err, users, fields){ //모든 회원의 정보를 불러온다
                if(err){console.log(err);}
                else{
                    if(users[0].u_id == u_id && users[0].u_pw == u_pw){ //아이디와 비밀번호가 맞다면
                         conn.conn.query(sql3, [u_id], function(err, login, fields){ //update를 한 후에 정보를 넘김
                            req.session.u_id = u_id;
                            req.session.save(function(){
                                res.redirect('/aku');
                            });
                        });
                    }
                    else{
                        req.session.save(function(){
                            res.redirect('/aku/login');
                        });
                    }
                }
            });
        }
        else{//만약 로그인 하려는 id가 없다면
            req.session.save(function(){
                res.redirect('/aku/login');
            });
        }
    });
};

exports.welcome = function(req, res){
    if(req.session.u_id){
        var sql = 'SELECT * FROM users WHERE u_id= ?';
        var sql2 = 'SELECT * from penobrol WHERE author = ?';
        var sql3 = 'SELECT * from tandya WHERE author = ?';
         conn.conn.query(sql, [req.session.u_id], function(err, user, fields){
             conn.conn.query(sql2, [req.session.u_id], function(err, penobrols, fields){
                if(err){console.log(err);}
                else{
                     conn.conn.query(sql3, [req.session.u_id], function(err, tandyas, fields){
                        res.render('aku', {user:user[0], penobrols:penobrols, tandyas:tandyas});
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

exports.logout = function(req, res){
    delete req.session.u_id;
    req.session.save(function(){
        res.redirect('/aku');
    });
};

exports.postRegister = function(req, res){
    var u_id = req.body.u_id;
    var u_pw = req.body.u_pw;
    var birthday = req.body.birthday;
    var u_sex = req.body.gender;
    var u_email = req.body.email;
    var sql2 = 'SELECT COUNT(u_id) AS u_id from users WHERE u_id = ?';
    var sql = 'INSERT INTO users (u_id, u_pw, u_bday, email, sex) VALUES (?, ?, ?, ?, ?)';
    var sql3 = 'UPDATE overview SET total_user = total_user + 1';
     conn.conn.query(sql2, [u_id], function(err, check, fields){
        if(err){console.log(err);}
        else{
            if(check[0].u_id){
            }
            else{
                 conn.conn.query(sql, [u_id, u_pw, birthday, u_email, u_sex], function(err, result, fields){
                    if(err){console.log(err);}
                });
                 conn.conn.query(sql3, function(err, update, fields){
                    if(err){console.log(err);}
                });
            }
        }
    });
    res.redirect('/aku/login');
};

exports.getRegister = function(req, res){
  res.render('user-add');
};
