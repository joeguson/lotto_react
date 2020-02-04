var nodemailer = require('nodemailer');
var key = require('../../info/beritamus-admin-2ff0df5d17ca.json');
var parser = require('../../db/parser.js');
var jsForBack = require('../../back/jsForBack.js');
var userDao = require('../../db/b-dao/userDao');
var penobrolDao = require('../../db/b-dao/penobrolDao');
var tandyaDao = require('../../db/b-dao/tandyaDao');

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

exports.login = function(req, res){
    //login이 이뤄질때
    var u_id = req.body.u_id;
    var u_pw = req.body.u_pw;
    async function userLogin(){
        var result = await userDao.matchCredential(u_id, u_pw);
        if(result[0]){
            if(parseInt(result[0].verify) == 1){
                await userDao.updateLoginDate(u_id);
                req.session.u_id = u_id;
                req.session.id2 = result[0].id;
                req.session.save(function(){
                    res.redirect('/aku');
                });
            }else{
                res.render('./ja/aku', {"message":"this email is not verified"});
            }
        }else{
            res.render('./ja/aku', {"message":"please check your id or password"});
        }
    }
    userLogin();
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
        async function getUserRecord(){
            userPenobrol = (await penobrolDao.penobrolByAuthor(req.session.id2)).map(parser.parseFrontPenobrol);
            userTandya = (await tandyaDao.tandyaByAuthor(req.session.id2)).map(parser.parseFrontTandya);
            for(var i = 0; i<userPenobrol.length;i++){
                userPenobrol[i].commentCount = (await penobrolDao.penobrolComCountById(userPenobrol[i].id))[0].count;
                userPenobrol[i].hashtags = (await penobrolDao.penobrolHashtagById(userPenobrol[i].id)).map(parser.parseHashtagP);
                userPenobrol[i].likeCount = (await penobrolDao.penobrolLikeCount(userPenobrol[i].id))[0].plikeCount;
            }
            for(var j = 0; j<userTandya.length;j++){
                userTandya[j].answerCount = (await tandyaDao.tandyaAnsCountById(userTandya[j].id))[0].count;
                userTandya[j].hashtags = (await tandyaDao.tandyaHashtagById(userTandya[j].id)).map(parser.parseHashtagT);
                userTandya[j].likeCount = (await tandyaDao.tandyaLikeCount(userTandya[j].id))[0].tlikeCount;
            }
            totalLikes.penobrol = (await penobrolDao.penobrolLikeCountByAuthor(req.session.id2))[0].total;
            totalLikes.tandya = (await tandyaDao.tandyaLikeCountByAuthor(req.session.id2))[0].total;
            totalLikes.comment = (await penobrolDao.penobrolComLikeCountByAuthor(req.session.id2))[0].total;
            totalLikes.answer = (await tandyaDao.tandyaAnsLikeCountByAuthor(req.session.id2))[0].total;
            res.render('./ja/aku', {
                user:req.session.id2,
                u_id:req.session.u_id,
                penobrols:userPenobrol,
                tandyas:userTandya,
                totalLikes:totalLikes
            });
        }
        getUserRecord();
    }
    else{
        res.render('./ja/aku');
    }
};

exports.getFindMyIdPw =function(req, res){
    res.render('./ja/findMyIdPw');
}

exports.getChangeUserInfoLogin =function(req, res){
    if(req.session.id2){
        res.render('./ja/changeUserInfoLogin');
    }else{
        res.redirect('/aku')
    }
}

exports.postChangeUserInfoLogin =function(req, res){
    if(req.session.id2){
        var u_id = req.body.u_id;
        var u_pw = req.body.u_pw;
        async function getUserInfo(){
            var result = await userDao.matchCredential(req.session.id2);
            req.session.valid = result[0];
            res.redirect('/aku/changeUserInfo');
        }
        getUserInfo();
    }else{
        res.redirect('/aku')
    }
}

exports.getChangeUserInfo =function(req, res){
    if(req.session.id2 && req.session.valid){
        async function getUserInfo(){
            var result = await userDao.matchCredential(req.session.id2);
            res.render('./ja/changeUserInfo', {user: result[0]});
        }
        getUserInfo();
    }
    else{
        res.redirect('/aku')
    }
}

exports.postChangeUserInfo =function(req, res){
    if(req.session.id2){
        var u_pw = req.body.u_pw;
        var birthday = req.body.birthday;
        var u_sex = req.body.gender;
        async function updateUser(){
            await userDao.updateUserInfo(u_pw, birthday, u_sex, req.session.id2);
            res.redirect('/aku');
        }
        updateUser();
    }
    else{
        res.redirect('/aku')
    }
}

exports.postFindMyIdPw =function(req, res){
    var userId = req.body.u_id;
    var birthday = req.body.birthday;
    var u_sex = req.body.gender;
    var u_email = req.body.email;
    var mailOptions = {
        from: 'admin@beritamus.com',    // 발송 메일 주소 (위에서 작성한 gmail 계정 아이디)
        to: u_email                     // 수신 메일 주소
    };
    var checkSql = '';
    if(req.body.u_id){
        //pw를 잃어버린 경우
        async function changeUserPW(){
            var check = await userDao.userBasicInfoById(userId)
            if(check[0].u_bday == birthday && check[0].sex == u_sex && check[0].email == u_email){
                var newPw = jsForBack.pwMaker();
                await userDao.updateUserPw(newPw, userId);
                mailOptions.subject = 'Your new password for beritamus.com';
                mailOptions.html = '<p>This is your new password.</p>'+'<p>password: <span style="text-decoration: underline">'+newPw+'</span></p>'+'<p>You can change your password any time!</p>';
                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        console.log(error);
                    }
                });
                res.redirect('/aku');
            }
            else{
                //이메일로 누군가 찾으려 시도하였지만 정보가 잘못 되었다 라고 전달
                mailOptions.subject = 'Your new password for beritamus.com';
                mailOptions.html = '<p>Attempts were made to find your password</p>'+'<p>However, some information did not match with yours</p>'+'<p>Please try again or ignore this email</p>';
                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        console.log(error);
                    }
                });
                res.redirect('/aku');
            }
        }
        changeUserPW();
    }
    else{
        //id를 잃어버린 경우
        async function noticeUserId(){
            var check = await userDao.userBasicInfoByEmail(u_email);
            if(check[0].u_bday == birthday && check[0].sex == u_sex){
                //이메일로 아이디 정보를 보내준다
                mailOptions.subject = 'Your id information for Beritamus';
                mailOptions.html = '<p>Below is your id for beritamus.com</p>'+check[0].u_id;
            }else{
                //이메일로 누군가 찾으려 시도하였지만 정보가 잘못 되었다 라고 전달
                mailOptions.subject = 'Your id information for Beritamus';
                mailOptions.html = '<p>Attempts were made to find your user ID</p>'+'<p>However, some information did not match with yours</p>'+'<p>Please try again or ignore this email</p>';
            }
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                }
            });
            res.redirect('/aku');
        }
        noticeUserId();
    }
}


exports.checkUserId = function(req, res){
    var result = 0;

    async function checkUserCount(){
        var count = [];
        if(req.body.type == 'id'){
            count = await userDao.userCountById(req.body.data);
        }else{
            count = await userDao.userCountByEmail(req.body.data);
        }
        if(parseInt(count[0].total) > 0){
            result = 1;
        }
        else{
            result = 0;
        }
        var responseData = {'result' : 'ok', 'length': result};
        res.json(responseData);
    }
    checkUserCount();
}

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
    delete req.session.id2;
    delete req.session.valid;
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

    async function insertUserInfo(){
        await userDao.insertUserInfo(u_id, u_pw, birthday, u_email, u_sex, code);
    }
    insertUserInfo();

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
