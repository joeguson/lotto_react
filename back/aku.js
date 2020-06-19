//url - '/aku'
const route = require('express').Router();
const jsForBack = require('./jsForBack.js');
const akuService = require('../service/akuService.js');
const geoip = require('geoip-lite');

// login
route.post('/login', function(req, res){
    //login이 이뤄질때
    const u_id = req.body.u_id;
    const u_pw = req.body.u_pw;
    // 아래의 코드는 접속 국가를 설정하기 위해 만듬
    // let ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    // let ipAddress = '112.157.39.243';
    // let geo = geoip.lookup(ipAddress);
    // let countryCode = 0;
    // if(geo.country === 'KR') countryCode = 82;
    // else if(geo.country === 'ID') countryCode = 62;
    // else countryCode = 1;
    akuService.userLogin(u_id, u_pw).then(result => {
        if(result.verify === 1){ //match credential
            akuService.updateLoginDate(u_id)
                .then(
                    req.session.u_id = u_id,
                    req.session.id2 = result.id,
                    req.session.save(function(){
                        res.redirect('/aku');
                    })
                );
        }
        else if(result === -1){
            res.render('./layouts/form_layouts/login', {
                "message":"please check your id or password"
            });
        }
        else{
            res.render('./layouts/form_layouts/login', {
                "message":"this email is not verified"
            });
        }
    });
});

route.get('/', function(req, res){
    if(req.session.id2) {
        akuService.getUserArticle(req.session.id2)
            .then(([userPenobrol, userTandya, userYoutublog, totalLikes]) => {
                akuService.countFollow(req.session.id2)
                    .then((follow) => {
                        res.render('./layouts/user_layouts/aku', {
                            user:req.session.id2,
                            u_id:req.session.u_id,
                            following: follow.following,
                            follower: follow.follower,
                            penobrols:userPenobrol,
                            tandyas:userTandya,
                            youtublogs:userYoutublog,
                            totalLikes:totalLikes
                        })});
            });
    }
    else{
        res.render('./layouts/form_layouts/login');
    }
});

route.get('/register', function(req, res){
    res.render('./layouts/form_layouts/register');
});

route.get('/login', function(req, res){
    if(req.query.email){
        let email = req.query.email;
        let code = req.query.code;
        akuService.verifyUserEmail(email, code)
            .then((result) => {
                if (result === 1) res.render('./layouts/form_layouts/login', {"message": "please login"});
                else if (result === 0) res.render('./layouts/form_layouts/login', {"message": "your verification code is wrong"});
                else res.render('./layouts/form_layouts/login', {"message": "wrong approach"});
            });
    }
    else res.redirect('/aku')
});

route.post('/register', function(req, res){
    akuService.postUser(
        req.headers.host,
        req.body.u_id,
        req.body.u_pw,
        req.body.birthday,
        req.body.gender,
        req.body.email,
        parseInt(jsForBack.codeMaker())
    ).then(res.redirect('/aku'));
});

route.get('/user/:user_id', function(req, res){
    let user_id = req.params.user_id;
        akuService.getUserArticleByForeigner(user_id, req.session.id2)
            .then(([userPenobrol, userTandya, userYoutublog, followResult]) => {
                akuService.countFollowByForeigner(user_id)
                    .then((result) => {
                        res.render('./layouts/user_layouts/aku_view', {
                        id2:req.session.id2,
                        u_id:user_id,
                        following: result.following,
                        follower: result.follower,
                        penobrols:userPenobrol,
                        tandyas:userTandya,
                        youtublogs:userYoutublog,
                        follow: followResult.length > 0
                        })
                    });
            });
});

route.get('/logout', function(req, res){
    delete req.session.u_id;
    delete req.session.id2;
    delete req.session.valid;
    res.redirect("/aku");
});

route.get('/find', function(req, res){
    res.render('./layouts/form_layouts/find_user_info');
});

route.post('/find', function(req, res){
    akuService.findUserInfo(
        req.body.u_id,
        req.body.birthday,
        req.body.gender,
        req.body.email
    ).then(res.redirect('/aku'));
});

route.get('/update', function(req, res){
    if(req.session.id2) res.render('./layouts/form_layouts/update_login', {
        u_id: req.session.u_id
    });
    else res.redirect('/aku')
});

route.post('/update', function(req, res){
    if(req.session.id2){
        akuService.userLogin(req.session.u_id, req.body.u_pw)
            .then(result => {
                if(result){
                    req.session.valid = 'valid';
                    res.redirect('/aku/update/info');
                }
                else res.redirect('/aku')
            }
        );
    }
    else res.redirect('/aku')
});

route.get('/update/info', function(req, res){
    if(req.session.id2 && req.session.valid){
        let result = akuService.getUserBasicInfo(req.session.id2)
            .then((result) => {
                res.render('./layouts/form_layouts/update_user_info', {
                    user: result
                });
            });
    }
    else res.redirect('/aku')
});

route.post('/update/info', function(req, res){
    if(req.session.id2){
        akuService.updateUserInfo(
            req.body.u_pw,
            req.session.id2
        ).then(res.redirect('/aku'));
    }
    else res.redirect('/aku')
});

module.exports = route;