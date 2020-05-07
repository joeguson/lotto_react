//url - '/youtublog'
const route = require('express').Router();
const articleService = require('../service/articleService.js');
const replyService = require('../service/replyService.js');
const youtublogService = require('../service/youtublogService.js');

/* ===== youtublog ===== */
route.get('/', function (req, res) {
    articleService.getFrontArticle('youtublog')
        .then(([results]) => res.render('./jy/y', {
            topics: results,
            id2: req.session.id2 ? req.session.id2 : 0
        }));
});

route.get('/:youtublog_no', function (req, res, next) {
    const id = req.params.youtublog_no;
    const checkId = /^[0-9]+$/;
    if(checkId.test(id)){
        articleService.getFullArticleById(id, req.session.id2, 'youtublog').then(result => {
            if (!result) res.redirect('/youtublog/'); // 결과가 없으면 홈으로 이동
            else articleService.updateViewArticle(result.id, 'youtublog').then(() => // 받아왔으면 조회수 증가 후 페이지 표시
                res.render('./jy/y-view', {
                    topic: result,
                    u_id: req.session.u_id,
                    id2: req.session.id2 ? req.session.id2 : 0
                })
            );
        });
    }
    else{
        next();
    }
});

route.get('/new',function (req, res) {
    if (req.session.u_id) {
        res.render('./jy/y-add');
    } else {
        res.redirect('/youtublog/');
    }
});

route.get('/edit/:youtublog_no', function (req, res) {
    const y_id = req.params['youtublog_no'];
    const u_id = req.session.id2;

    articleService.getFullArticleById(y_id, req.session.id2, 'youtublog').then(youtublog => {
        if(youtublog && youtublog.author === u_id)
            res.render('./edit_layout', {
                u_id: u_id,
                type: 'youtublog',
                article: youtublog
            });
        else res.redirect('/youtublog/' + y_id);
    });
});

route.get('/edit/comment/:youtublog_no/:ycomment_no',function (req, res) {
    const y_id = req.params.youtublog_no;
    const yc_id = req.params.ycomment_no;
    const u_id = req.session.id2;

    replyService.getReplyById(yc_id, 'youtublog').then(comment => {
        if (u_id !== comment.author) res.redirect('/comment/view/' + y_id);
        else articleService.getFullArticleById(y_id, req.session.id2, 'youtublog').then(youtublog => {
            res.render('./jy/yc-edit', {
                id2: req.session.id2 ? req.session.id2 : 0,
                topic: youtublog,
                edit_content: comment
            });
        });
    });
});


route.get('/embed/:id', function(req, res) {
    const id = req.params.id;

    const edit = req.query.edit;
    const template = edit === '1' ? './embed/youtube_embed_edit' : './embed/youtube_embed';

    youtublogService.getYoutubeById(id).then(youtube =>
        res.render(template, {youtube: youtube})
    );
});

route.all('*', function(req, res){
    res.redirect('/youtublog');
});

module.exports = route;