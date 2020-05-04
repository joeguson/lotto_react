/*
 * Copyright (c) 2020. Created by Seung Joo Noh.
 * All rights reserved.
 */

// url - '/api/reply
const route = require('express').Router();
const jsForBack = require('../back/jsForBack.js');

const readReplyService = require('../service/replyService');

/* ===== GET /{type}/{id} ===== */
// article의 reply를 요청하는 api

route.get('/:type/:id', (req, res) => {
    const type = req.params['type'];
    const articleId = req.params.id;
    const checkId = /^[0-9]+$/;
    if(checkId.test(articleId)){
        readReplyService.getFullReply(articleId, req.session.id2, type)
            .then(reply => {
                res.json({
                    'result': reply
                })}
            ).catch((e) => {
                console.error(e);
                res.status(500).send('Could not warn article')
            }
        );
    }
});

/* ===== POST /{id} ===== */
// article에 reply를 추가하는 api
route.post('/:article_id', function (req, res) {
    switch(req.body.type){
        case 'pc' : req.body.type = 'penobrol'; break;
        case 'a' : req.body.type = 'tandya'; break;
        case 'yc' : req.body.type = 'youtublog'; break;
    }
    readReplyService.postReply(
        req.body.articleId,
        req.session.id2,
        req.body.type,
        req.body.content
    ).then((result) => {
        let final = {};
        final.userId = req.session.id2;
        final.type = req.body.type;
        final.reply = result;
        res.json(final);
    }).catch(() =>
        res.status(500).send('Could not post reply')
    );
});

module.exports = route;