/*
 * Copyright (c) 2020. Created by Seung Joo Noh.
 * All rights reserved.
 */

// url - '/api/like
const route = require('express').Router();
const jsForBack = require('../back/jsForBack.js');

const likeService = require('../service/readLikeService');

//**********  Like **********//


/* ===== POST /{type}/like ===== */
// article type 에 따른 like 요청 함수
const likeFunctions = {
    article: likeService.likeArticle,
    reply: likeService.likeReply
};
const likeCountFunctions = {
    article: likeService.articleLikeCount,
    reply: likeService.replyLikeCount
};

// article 에 like/취소 를 요청하는 api
route.post('/:type/:element',(req, res) => {
    const element = req.params['element']; // req.params.element
    const type = req.params['type'];
    const likeFunction = likeFunctions[element];
    const likeCountFunction = likeCountFunctions[element];
    const id = req.body.id;
    const cancel = req.body.cancel;

    if (likeFunction == null) res.status(400).send('Wrong article type');
    else likeFunction(
        id,
        req.session.id2,
        cancel,
        type
    ).then(val =>
        likeCountFunction(id, type).then(count =>
            res.json({
                'result': count,
                'button': val
            })
        ).catch(() => res.status(500).send('Cannot load state'))
    ).catch(() => res.status(409).send('Already in like state'));
});
module.exports = route;