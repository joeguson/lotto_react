//url - '/youtublog'
const route = require('express').Router();
var jsForBack = require('./jsForBack.js');
const youtublogService = require('../service/youtublogService.js');

/************FOR YOUTUBLOG************/
route.get('/', function (req, res) {
    youtublogService.getOrderedYoutublog()
        .then(([dateTopics, scoreTopics]) => res.render('./jy/y', {
            dateTopics: dateTopics,
            scoreTopics: scoreTopics,
            id2: req.session.id2
        }));
});

route.get('/:youtublog_no', function (req, res, next) {
    const id = req.params.youtublog_no;
    const checkId = /^[0-9]+$/;
    if(checkId.test(id)){
        youtublogService.getFullYoutublogById(id).then(result => {
            if (!result) res.redirect('/youtublog/'); // 결과가 없으면 홈으로 이동
            else youtublogService.updateYoutublogView(result.id).then(() => // 받아왔으면 조회수 증가 후 페이지 표시
                res.render('./jy/y-view', {
                    topic: result,
                    u_id: req.session.u_id,
                    id2: req.session.id2,
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

route.post('/comment/:youtublog_no', function (req, res) {
    const y_id = req.params.youtublog_no;
    youtublogService.postComment(
        y_id,
        req.session.id2,
        req.body.comment
    ).then(() => res.redirect('/youtublog/' + y_id));
});

route.get('/edit/:youtublog_no', function (req, res) {
    const y_id = req.params.youtublog_no;
    const u_id = req.session.id2;

    youtublogService.getFullYoutublogById(y_id).then(youtublog => {
        if(youtublog != null && youtublog.author === u_id)
            res.render('./jy/y-edit', {u_id: u_id, edit_content: youtublog});
        else res.redirect('/youtublog/' + y_id);
    });
});

route.get('/edit/comment/:youtublog_no/:ycomment_no',function (req, res) {
    const y_id = req.params.youtublog_no;
    const yc_id = req.params.ycomment_no;
    const u_id = req.session.id2;

    youtublogService.getCommentById(yc_id).then(comment => {
        if (u_id !== comment.author) res.redirect('/comment/view/' + y_id);
        else youtublogService.getFullYoutublogById(y_id).then(youtublog => {
            res.render('./jy/yc-edit', {
                u_id: 'y',
                topic: youtublog,
                edit_content: comment
            });
        });
    });
});

route.put('/comment/:youtublog_no/:ycooment_no',function (req, res) {
    const y_id = req.params.youtublog_no;
    youtublogService.editComment(
        req.params.ycomment_no,
        y_id,
        req.body.comment
    ).then(() => res.redirect('/youtublog/'+ y_id));
});

route.delete('/:id', function(req, res){
    youtublogService.deleteYoutublog(
        req.body.deleteId,
        req.session.id2
    ).then(result => {
        if(result) res.json({"result": "deleted"});
        else res.redirect('/youtublog');
    });
});

route.delete('/comment/:id',  function(req, res){
    youtublogService.deleteComment(
        req.body.deleteId,
        req.session.id2
    ).then(result => {
        if(result) res.json({"result": "deleted"});
        else res.redirect('/youtublog/' + req.body.youtublogId);
    });
});

route.delete('/ccomment/:id', function(req, res){
    youtublogService.deleteCComment(
        req.body.deleteId,
        req.session.id2
    ).then(result => {
        if(result) res.json({"result": "deleted"});
        else res.redirect('/youtublog/' + req.body.youtublogId);
    });
});

route.all('*', function(req, res){
    res.redirect('/youtublog');
});

module.exports = route;