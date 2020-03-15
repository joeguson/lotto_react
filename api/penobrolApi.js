//url - '/api/penobrol'
const route = require('express').Router();
const penobrolService = require('../service/penobrolService.js');

/************************Penobrol************************/

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
    ).then(result => res.json({"result": result}));
});

module.exports = route;