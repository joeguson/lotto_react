//url - '/aku'
let userDao = require('../db/b-dao/userDao');
const route = require('express').Router();
const jsForBack = require('./jsForBack.js');
const akuService = require('../service/akuService.js');

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

route.get('/:user_id', function(req, res){
    const user_id = req.params.user_id;
    akuService.getUserArticleByForeigner(user_id)
        .then(([userPenobrol, userTandya]) => res.render('./ja/akuView', {
            user:req.session.id2,
            u_id:req.session.u_id,
            penobrols:userPenobrol,
            tandyas:userTandya,
        }));
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
    if(req.session.id2) res.render('./ja/changeUserInfoLogin');
    else res.redirect('/aku')
});

route.post('/change', function(req, res){
    if(req.session.id2){
        akuService.userLogin(req.body.u_id, req.body.u_pw)
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