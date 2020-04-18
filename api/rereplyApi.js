/*
 * Copyright (c) 2020. Created by Seung Joo Noh.
 * All rights reserved.
 */

// url - '/api/rereply
const route = require('express').Router();
const jsForBack = require('../back/jsForBack.js');

const articleService = require('../service/articleService');
const penobrolService = require('../service/penobrolService.js');
const tandyaService = require('../service/tandyaService.js');
const youtublogService = require('../service/youtublogService.js');

const articleMainColumns = {
    penobrol: "title",
    tandya: "question",
    youtublog: "title"
};

/* ===== POST /{type}/re-reply ===== */
// article type 에 따른 re-reply post 요청 함수
const re_replyPostFunctions = {
    penobrol: penobrolService.postCommentCom,
    tandya: tandyaService.postAnswerCom,
    youtublog: youtublogService.postCommentCom
};
// reply 에 like/취소 를 요청하는 api
route.post('/:type/re-reply', (req, res) => {
    const type = req.params['type'];
    const postFunction = re_replyPostFunctions[type];

    if (postFunction == null)
        res.status(400).send('Wrong article type');
    else postFunction(
        req.body.id,
        req.session.id2,
        req.body.content
    ).then(re =>
        res.json({
            'id': re.id,
            'author': req.session.u_id
        })
    ).catch(() =>
        res.status(500).send('Could not post re-reply')
    );
});

//**********  Warn **********//

/* ===== POST /{type}/warn ===== */
// article type 에 따른 warn 요청 함수
const articleWarnFunctions = {
    penobrol: penobrolService.warnPenobrol,
    tandya: tandyaService.warnTandya,
    youtublog: youtublogService.warnYoutublog
};

const articleDidWarnFunctions = {
    penobrol: penobrolService.didWarnPenobrol,
    tandya: tandyaService.didWarnTandya,
    youtublog: youtublogService.didWarnYoutublog
};


//**********  DELETE **********//

/* ===== DELETE /{type}/re-reply ===== */
// re-reply type 에 따른 warn 요청 함수
const reReplyDeleteFunctions = {
    penobrol: penobrolService.deleteCComment,
    tandya: tandyaService.deleteAComment,
    youtublog: youtublogService.deleteCComment
};

route.delete('/:type/re-reply',
    __getDeleteRequestHandlerFunction(
        reReplyDeleteFunctions
    )
);

function __getDeleteRequestHandlerFunction(deleteFunctions) {
    return (req, res) => {
        const type = req.params['type']; // req.params.type
        const deleteFunction = deleteFunctions[type];

        if (deleteFunction == null)
            res.status(400).send("Wrong article type");
        deleteFunction(req.body.delete_id, req.session.id2)
            .then(result => {
                res.json({
                    "result": "deleted"
                })
            }).catch(() => res.status(499).send('Cannot load state'));
    }
}


module.exports = route;