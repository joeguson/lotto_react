//url - '/api/youtublog'
const route = require('express').Router();
const youtublogService = require('../service/youtublogService.js');

/* ===== Youtublog ===== */

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
    ).then(result => res.json({"result": result}));
});


module.exports = route;