//url - '/aku'
let nodemailer = require('nodemailer');
let key = require('../info/beritamus-admin-2ff0df5d17ca.json');
let parser = require('../db/parser.js');
let userDao = require('../db/b-dao/userDao');
let penobrolDao = require('../db/b-dao/penobrolDao');
let tandyaDao = require('../db/b-dao/tandyaDao');
let config =require('../config.json');
const route = require('express').Router();
const jsForBack = require('./jsForBack.js');
const tandyaService = require('../service/tandyaService.js');
const penobrolService = require('../service/penobrolService.js');
const akuService = require('../service/akuService.js');

var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: key.mail_config
});

route.get('/daftar', function(req, res){
    if(req.query.email){
        let email = req.query.email;
        let code = req.query.code;
        let result = akuService.verifyUserEmail(email, code)
            .then((result) => {
                if (result === 1) res.render('./ja/aku');
                else if (result === 0) res.render('./ja/aku', {"message": "your verification code is wrong"});
                else res.render('./ja/aku', {"message": "wrong approach"});
            });
    }
    else res.render('./ja/user-add');
});

route.post('/daftar', function(req, res){
    akuService.postUser(
        req.body.u_id,
        req.body.u_pw,
        req.body.birthday,
        req.body.gender,
        req.body.email,
        parseInt(jsForBack.codeMaker())
    ).then(res.redirect('/aku'));
});

route.get('/', function(req, res){
    if(req.session.u_id) {
        let userInfo = [];
        akuService.getUserArticle(req.session.id2)
            .then(([userPenobrol, userTandya, totalLikes]) => res.render('./ja/aku', {
                user:req.session.id2,
                u_id:req.session.u_id,
                penobrols:userPenobrol,
                tandyas:userTandya,
                totalLikes:totalLikes
            }));
    }
    else{
        res.render('./ja/aku');
    }
});

route.post('/login', function(req, res){
    //login이 이뤄질때
    const u_id = req.body.u_id;
    const u_pw = req.body.u_pw;
    akuService.userLogin(u_id, u_pw).then(result => {
        if (!result) res.render('./ja/aku', {
            "message":"please check your id or password"
        });
        else {
            if (parseInt(result.verify) == 1){
                akuService.updateLoginDate(u_id).then(
                    req.session.u_id = u_id,
                    req.session.id2 = result.id,
                    req.session.save(function(){
                        res.redirect('/aku');
                    })
                );
            }
            else{
                res.render('./ja/aku', {
                    "message":"this email is not verified"
                });
            }
        }
    });
});

route.get('/logout', function(req, res){
    delete req.session.u_id;
    delete req.session.id2;
    delete req.session.valid;
    req.session.save(function(){
        res.redirect('/aku');
    });
});

route.get('/find', function(req, res){
    res.render('./ja/findMyIdPw');
});

route.post('/find', function(req, res){
    akuService.findUserInfo(
        req.body.u_id,
        req.body.birthday,
        req.body.gender,
        req.body.email
    ).then(res.redirect('/aku'));
});

route.get('/change', function(req, res){
    if(req.session.id2){
        res.render('./ja/changeUserInfoLogin');
    }else{
        res.redirect('/aku')
    }
});

route.post('/change', function(req, res){
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
});

route.get('/change', function(req, res){
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
});

route.post('/change', function(req, res){
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
});

route.get('/auth', function(req, res){
    var u_pw = req.body.u_pw;
    var birthday = req.body.birthday;
    var u_sex = req.body.gender;
    async function updateUser(){
        await userDao.updateUserInfo(u_pw, birthday, u_sex, req.session.id2);
        res.redirect('/aku');
    }
    updateUser();
});

module.exports = route;