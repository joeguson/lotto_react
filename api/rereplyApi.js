/*
 * Copyright (c) 2020. Created by Seung Joo Noh.
 * All rights reserved.
 */

// url - '/api/rereply
const route = require('express').Router();
const jsForBack = require('../back/jsForBack.js');

const reReplyService = require('../service/rereplyService');

/* ===== POST /{type}/re-reply ===== */
// article type 에 따른 re-reply post 요청 함수

route.post('/:reply_id', (req, res) => {
    reReplyService.postReReply(
        req.body.replyId,
        req.session.id2,
        req.body.type,
        req.body.content
    ).then((result) => {
        let final = {};
        final.userId = req.session.id2;
        final.type = req.body.type;
        final.rereply = result;
        res.json(final);
    }).catch(() =>
        res.status(500).send('Could not post re-reply')
    );
});

module.exports = route;