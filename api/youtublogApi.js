//url - '/api/youtublog'
const route = require('express').Router();
const jsForBack = require('../back/jsForBack.js');
const youtublogService = require('../service/youtublogService.js');

/* ===== Youtublog ===== */

route.post('/', function (req, res) {
    youtublogService.postYoutublog(
        req.session.id2,
        req.body.title,
        req.body.content,
        req.body.public,
        req.body.thumbnail,
        jsForBack.finalHashycgMaker(req.body.hashycg)
    ).then(id => res.send({"id": id}));
});

route.put('/:youtublog_no', function (req, res) {
    youtublogService.editYoutublog(
        req.params.youtublog_no,
        req.body.title,
        req.body.content,
        req.body.public,
        req.body.thumbnail,
        jsForBack.finalHashycgMaker(req.body.hashycg)
    ).then(y_id => res.json({ "id": y_id }));
});

//************************Like************************//
route.post('/like', function (req, res) {
    const y_id = req.body.y_id;
    youtublogService.likeYoutublog( //유효한 y_id인지 확인필요
            y_id,
        req.session.id2,
        parseInt(req.body.clickVal)
    ).then(val => {
        youtublogService.youtublogLikeCount(y_id).then(count =>
            res.json({
                "y_like": count,
                "button": val
            })
        );
    });
});

route.post('/like/comment', function (req, res) {
    const yc_id = req.body.yc_id;
    youtublogService.likeYoutublogComment(//유효한 yc_id인지 확인필요
        yc_id,
        req.session.id2,
        parseInt(req.body.clickVal)
    ).then(val => {
        youtublogService.youtublogComLikeCount(yc_id).then(count =>
            res.json({
                "yc_like": count,
                "button": val
            })
        );
    });
});

route.post('/ccomment/:y_id/:yc_id', function (req, res) {
    youtublogService.postCommentCom(
        req.params.yc_id,
        req.session.id2,
        req.body.pcctacContent
    ).then(com => res.json({
        "ycomment_id": com.id,
        "ycomment_author": com.u_id,
        "ycomment_content": com.content,
        "ycomment_date": com.date
    }));
});


//************************Warn************************//
route.post('/warn', function (req, res) {
    youtublogService.warnYoutublog(
        req.body.warnedItem,
        req.body.warnedId,
        req.session.id2
    ).then(result => res.json({ "result": result }));
});


module.exports = route;