//url - '/tandya'
const route = require('express').Router();
const articleService = require('../service/articleService.js');
const replyService = require('../service/replyService.js');

/* ===== tandya ===== */
route.get('/', function (req, res) {
    articleService.getFrontArticle('tandya')
        .then((results) => {
            res.render('./layouts/front_layouts/t', {
            topics: results,
            id2: req.session.id2 ? req.session.id2 : 0
        })}
        );
});

route.get('/:tandya_no', function (req, res, next) {
    const id = req.params.tandya_no;
    const checkId = /^[0-9]+$/;
    if (checkId.test(id)) {
        articleService.getFullArticleById(id, req.session.id2, 'tandya').then(result => {
            if (!result) res.redirect('/tandya/'); // 결과가 없으면 홈으로 이동
            else articleService.updateViewArticle(result.id, 'tandya').then(() => // 받아왔으면 조회수 증가 후 페이지 표시
                res.render('./layouts/article_view_layouts/t-view', {
                    topic: result,
                    u_id: req.session.u_id,
                    id2: req.session.id2 ? req.session.id2 : 0
                })
            );
        });
    }
    else next();
});

route.get('/new', function (req, res) {
    if (req.session.id2) {
        res.render('./layouts/article_add_layouts/t-add', {id2: req.session.id2});
    } else {
        res.redirect('/tandya');
    }
});

route.get('/:id/answer/new', function (req, res) {
    const articleId = req.params.id;
    const checkId = /^[0-9]+$/;
    if (req.session.id2) {
        if (checkId.test(articleId)) {
            articleService.getFullArticleById(articleId, req.session.id2, 'tandya').then(result => {
                if (!result) res.redirect('/tandya/'); // 결과가 없으면 홈으로 이동
                else {
                    res.render('./layouts/reply_add_layouts/t-answer', {
                        topic: result,
                        u_id: req.session.u_id,
                        id2: req.session.id2 ? req.session.id2 : 0
                    })
                }
            });
        }
    } else {
        res.redirect('/tandya/');
    }
});

route.get('/edit/:tandya_no', function (req, res) {
    const t_id = req.params.tandya_no;
    const u_id = req.session.id2;

    articleService.getFullArticleById(t_id, req.session.id2, 'tandya').then(tandya => {
        if(tandya != null && tandya.author === u_id)
            res.render('./layouts/edit_layout', {
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

    replyService.getReplyById(ta_id, 'tandya').then(answer => {
        if (u_id !== answer.author) res.redirect('/tandya/' + t_id);
        else articleService.getFullArticleById(t_id, 'tandya').then(tandya => {
            res.render('./layouts/reply_edit_layouts/ta-edit', {
                u_id: 'y',
                topic: tandya,
                edit_content: answer
            });
        });
    });
});


route.all('*', function(req, res){
    res.redirect('/tandya');
});

module.exports = route;