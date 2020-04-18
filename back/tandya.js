//url - '/tandya'
const route = require('express').Router();
const articleService = require('../service/articleService.js');
const readArticleService = require('../service/readArticleService.js');
const tandyaService = require('../service/tandyaService.js');

/* ===== tandya ===== */

route.get('/', function (req, res) {
    tandyaService.getOrderedTandya()
        .then(([dateTopics, scoreTopics]) => res.render('./jt/t', {
            dateTopics: dateTopics,
            scoreTopics: scoreTopics,
            id2: req.session.id2
        }));
});

route.get('/:tandya_no', function (req, res, next) {
    const id = req.params.tandya_no;
    const checkId = /^[0-9]+$/;
    if (checkId.test(id)) {
        readArticleService.getFullArticleById(id, req.session.id2, 'tandya').then(result => {
            if (!result) res.redirect('/tandya/'); // 결과가 없으면 홈으로 이동
            else tandyaService.updateTandyaView(result.id).then(() => // 받아왔으면 조회수 증가 후 페이지 표시
                res.render('./jt/t-view', {
                    topic: result,
                    u_id: req.session.u_id,
                    id2: req.session.id2,
                })
            );
        });
    }
    else {
        next();
    }
});

route.get('/new', function (req, res) {
    if (req.session.id2) {
        res.render('./jt/t-add', {id2: req.session.id2});
    } else {
        res.redirect('/tandya/');
    }
});

route.post('/answer/:tandya_no', function (req, res) {
    const t_id = req.params.tandya_no;
    tandyaService.postAnswer(
        t_id,
        req.session.id2,
        req.body.answer
    ).then(() => res.redirect('/tandya/' + t_id));
});

route.get('/edit/:tandya_no', function (req, res) {
    const t_id = req.params.tandya_no;
    const u_id = req.session.id2;

    tandyaService.getFullTandyaById(t_id).then(tandya => {
        if(tandya != null && tandya.author === u_id)
            res.render('./article_edit', {
                u_id: u_id,
                type: 'tandya',
                article: tandya
            });
        else res.redirect('/tandya/' + t_id);
    });
});

route.get('/edit/answer/:tandya_no/:tanswer_no', function (req, res) {
    const t_id = req.params.tandya_no;
    const ta_id = req.params.tanswer_no;
    const u_id = req.session.id2;

    tandyaService.getAnswerById(ta_id).then(answer => {
        if (u_id !== answer.author) res.redirect('/tandya/' + t_id);
        else tandyaService.getFullTandyaById(t_id).then(tandya => {
            res.render('./jt/ta-edit', {
                u_id: 'y',
                topic: tandya,
                edit_content: answer
            });
        });
    });
});

route.put('/answer/:tandya_no/:tanswer_no', function (req, res) {
    const t_id = req.params.tandya_no;
    tandyaService.editAnswer(
        req.params.tanswer_no,
        t_id,
        req.body.answer
    ).then(() => res.redirect('/tandya/'+ t_id));
});

route.delete('/:id', function (req, res) {
    tandyaService.deleteTandya(
        req.body.deleteId,
        req.session.id2
    ).then(result => {
        if(result) res.json({"result": "deleted"});
        else res.redirect('/tandya');
    });
});

route.delete('/answer/:id', function (req, res) {
    tandyaService.deleteAnswer(
        req.body.deleteId,
        req.session.id2
    ).then(result => {
        if(result) res.json({"result": "deleted"});
        else res.redirect('/tandya/' + req.body.tandyaId);
    });
});

route.delete('/acomment/:id', function (req, res) {
    tandyaService.deleteAComment(
        req.body.deleteId,
        req.session.id2
    ).then(result => {
        if(result) res.json({"result": "deleted"});
        else res.redirect('/tandya/' + req.body.tandyaId);
    });
});

route.all('*', function(req, res){
    res.redirect('/tandya');
});

module.exports = route;