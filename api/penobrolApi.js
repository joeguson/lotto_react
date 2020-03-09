//url - '/api/penobrol'
const route = require('express').Router();
const jsForBack = require('../back/jsForBack.js');
const penobrolService = require('../service/penobrolService.js');

/************************Penobrol************************/

route.post('/', function (req, res) {
    penobrolService.postPenobrol(
        req.session.id2,
        req.body.title,
        req.body.content,
        req.body.public,
        req.body.thumbnail,
        jsForBack.finalHashtagMaker(req.body.hashtag)
    ).then(id => res.json({"id": id}));
});

route.put('/:penobrol_no', function (req, res) {
    penobrolService.editPenobrol(
        req.params.penobrol_no,
        req.body.title,
        req.body.content,
        req.body.public,
        req.body.thumbnail,
        jsForBack.finalHashtagMaker(req.body.hashtag)
    ).then(p_id => res.json({ "id": p_id }));
});

route.post('/like', function (req, res) {
    const p_id = req.body.articleId;
    penobrolService.likePenobrol(
        p_id,
        req.session.id2,
        parseInt(req.body.clickVal)
    ).then(val => {
        penobrolService.penobrolLikeCount(p_id).then(count =>
            res.json({
                "result": count,
                "button": val
            })
        );
    });
});

route.post('/like/comment', function (req, res) {
    const pc_id = req.body.comAnsId;
    penobrolService.likePenobrolComment(
        pc_id,
        req.session.id2,
        parseInt(req.body.clickVal)
    ).then(val => {
        penobrolService.penobrolComLikeCount(pc_id).then(count =>
            res.json({
                "result": count,
                "button": val
            })
        );
    });
});

route.post('/ccomment/:p_id/:pc_id', function (req, res) {
    penobrolService.postCommentCom(
        req.params.pc_id,
        req.session.id2,
        req.body.pcctacContent
    ).then(com => res.json({
        "ccomment_id": com.id,
        "ccomment_author": com.u_id,
        "ccomment_content": com.content,
        "ccomment_date": com.date
    }));
});

route.post('/warn', function (req, res) {
    penobrolService.warnPenobrol(
        req.body.warnedItem,
        req.body.warnedId,
        req.session.id2
    ).then(result => res.json({ "result": result }));
});

module.exports = route;