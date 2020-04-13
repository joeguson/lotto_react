//url - '/aku'
let userDao = require('../db/b-dao/userDao/userDao');
const ajax = require("xmlhttprequest").XMLHttpRequest;
const route = require('express').Router();
const jsForBack = require('./jsForBack.js');
const akuService = require('../service/akuService.js');
const geoip = require('geoip-lite');

route.get('/register', function(req, res){
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
    else res.render('./ja/register');
});

route.post('/register', function(req, res){
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
        akuService.getUserArticle(req.session.id2)
            .then(([userPenobrol, userTandya, userYoutublog, totalLikes]) => {
                akuService.countFollow(req.session.id2)
                    .then(([following, follower]) => {
                        res.render('./ja/aku', {
                        user:req.session.id2,
                        u_id:req.session.u_id,
                        following: following[0].following,
                        follower: follower[0].follower,
                        penobrols:userPenobrol,
                        tandyas:userTandya,
                        youtublog:userYoutublog,
                        totalLikes:totalLikes
                    })});
            });
    }
    else{
        res.render('./ja/login');
    }
});

route.get('/user/:user_id', function(req, res, next){
    let user_id = req.params.user_id;
        akuService.getUserArticleByForeigner(user_id, req.session.id2)
            .then(([userPenobrol, userTandya, userYoutublog, followResult]) => {
                akuService.countFollowByForeigner(user_id)
                    .then(([following, follower]) => res.render('./ja/aku_view', {
                        user:req.session.id2,
                        u_id:user_id,
                        following: following[0].following,
                        follower: follower[0].follower,
                        penobrols:userPenobrol,
                        tandyas:userTandya,
                        youtublogs:userYoutublog,
                        follow: followResult.length > 0
                    }));
            });
});

route.get('/logout', function(req, res){
    delete req.session.u_id;
    delete req.session.id2;
    delete req.session.valid;
    res.redirect("/aku");
});


route.post('/login', function(req, res){
    //login이 이뤄질때
    const u_id = req.body.u_id;
    const u_pw = req.body.u_pw;
    // 아래의 코드는 접속 국가를 설정하기 위해 만듬
    // let ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    let ipAddress = '112.157.39.243';
    let geo = geoip.lookup(ipAddress);
    let countryCode = 0;
    if(geo.country === 'KR') countryCode = 82;
    else if(geo.country === 'ID') countryCode = 62;
    else countryCode = 1;
    akuService.userLogin(u_id, u_pw).then(result => {
        if (!result) res.render('./ja/aku', {
            "message":"please check your id or password"
        });
        else {
            if (parseInt(result.verify) == 1){
                akuService.updateLoginDate(u_id).then(
                    req.session.u_id = u_id,
                    req.session.id2 = result.id,
                    req.session.countryCode = countryCode,
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
    res.redirect('/aku');
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
    if(req.session.id2) res.render('./ja/change_login', {
        u_id: req.session.u_id
    });
    else res.redirect('/aku')
});

route.post('/change', function(req, res){
    if(req.session.id2){
        akuService.userLogin(req.session.u_id, req.body.u_pw)
            .then(result => {
                if(result){
                    req.session.valid = 'valid';
                    res.redirect('/aku/change/info');
                }
                else res.redirect('/aku')
            }
        );
    }
    else res.redirect('/aku')
});

route.get('/change/info', function(req, res){
    if(req.session.id2 && req.session.valid){
        let result = akuService.getUserBasicInfo(req.session.id2)
            .then((result) => {
                res.render('./ja/changeUserInfo', {
                    user: result
                });
            });
    }
    else res.redirect('/aku')
});

route.post('/change/info', function(req, res){
    if(req.session.id2){
        akuService.updateUserInfo(
            req.body.u_pw,
            req.session.id2
        ).then(res.redirect('/aku'));
    }
    else res.redirect('/aku')
});

module.exports = route;