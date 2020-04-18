/*
 * Copyright (c) 2020. Created by Seung Joo Noh.
 * All rights reserved.
 */

// url - '/api/reply
const route = require('express').Router();
const jsForBack = require('../back/jsForBack.js');

const readReplyService = require('../service/readReplyService');

/* ===== GET /{type}/reply ===== */

// article의 reply를 요청하는 api
route.get('/:type/:id', (req, res) => {
    const type = req.params['type'];
    const articleId = req.params.id;

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
});

route.post('/:article_id', function (req, res) {
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