// url - '/api/article
const route = require('express').Router();
const jsForBack = require('../back/jsForBack.js');

const articleService = require('../service/articleService.js');
const penobrolService = require('../service/penobrolService.js');
const tandyaService = require('../service/tandyaService.js');
const youtublogService = require('../service/youtublogService.js');

const articleMainColumns = {
    penobrol: "title",
    tandya: "question",
    youtublog: "title"
};

/* ===== POST /{type} ===== */
// article type 에 따른 post 함수
const articlePostFunctions = {
    penobrol: penobrolService.postPenobrol,
    tandya: tandyaService.postTandya,
    youtublog: youtublogService.postYoutublog
};
// 새 article 을 추가하는 api
route.post('/:type', (req, res) => {
    const type = req.params['type'];
    const postFunction = articlePostFunctions[type];
    const column = req.body[articleMainColumns[type]];

    if (postFunction == null)
        res.status(400).send('Wrong article type');
    else postFunction(
        req.session.id2,
        column,
        req.body.content,
        req.body.public,
        req.body.thumbnail,
        jsForBack.finalHashtagMaker(req.body.hashtag)
    ).then(id =>
        res.json({'id': id})
    ).catch(() =>
        res.status(500).send('Could not post article')
    );
});

/* ==== PUT /{type}/{id} ===== */
// article type 에 따른 edit 함수
const articleEditFunctions = {
    penobrol: penobrolService.editPenobrol,
    tandya: tandyaService.editTandya,
    youtublog: youtublogService.editYoutublog
};
// article 을 수정하는 api
route.put('/:type/:id', (req, res) => {
    const type = req.params['type'];
    const editFunction = articleEditFunctions[type];
    const column = req.body[articleMainColumns[type]];

    if (editFunction == null)
        res.status(400).send('Wrong article type');
    else editFunction(
        req.params['id'],
        column,
        req.body.content,
        req.body.public,
        req.body.thumbnail,
        jsForBack.finalHashtagMaker(req.body.hashtag)
    ).then(id =>
        res.json({'id': id})
    ).catch(() =>
        res.status(500).send('Could not edit article')
    );
});

/* ===== POST /{type}/like ===== */
// article type 에 따른 like 요청 함수
const articleLikeFunctions = {
    penobrol: penobrolService.likePenobrol,
    tandya: tandyaService.likeTandya,
    youtublog: youtublogService.likeYoutublog
};
// like 의 개수를 받아오는 함수
const articleLikeCountFunctions = {
    penobrol: penobrolService.penobrolLikeCount,
    tandya: tandyaService.tandyaLikeCount,
    youtublog: youtublogService.youtublogLikeCount
};
// article 에 like/취소 를 요청하는 api
route.post('/:type/like',
    __getLikeRequestHandlerFunction(
        articleLikeFunctions,
        articleLikeCountFunctions,
        "articleId"
    )
);

/* ===== POST /{type}/reply/like ===== */
// article type 에 따른 reply like 요청 함수
const replyLikeFunctions = {
    penobrol: penobrolService.likePenobrolComment,
    tandya: tandyaService.likeTandyaAnswer,
    youtublog: youtublogService.likeYoutublogComment
};
// reply 의 like 의 개수를 받아오는 함수
const replyLikeCountFunctions = {
    penobrol: penobrolService.penobrolComLikeCount,
    tandya: tandyaService.tandyaAnsLikeCount,
    youtublog: youtublogService.youtublogComLikeCount
};
// reply 에 like/취소 를 요청하는 api
route.post('/:type/reply/like',
    __getLikeRequestHandlerFunction(
        replyLikeFunctions,
        replyLikeCountFunctions,
        "comAnsId"
    )
);

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

/* ===== POST /{type}/warn ===== */
// article type 에 따른 warn 요청 함수
const warnPostFunctions = {
    penobrol: penobrolService.warnPenobrol,
    tandya: tandyaService.warnTandya,
    youtublog: youtublogService.warnYoutublog
};
// reply 에 like/취소 를 요청하는 api
route.post('/:type/warn', (req, res) => {
    const type = req.params['type'];
    const warnPostFunction = warnPostFunctions[type];

    if (warnPostFunction == null)
        res.status(400).send('Wrong article type');
    else warnPostFunction(
        req.body.warnedItem,
        req.body.warnedId,
        req.session.id2
    ).then(re =>
        res.json({
            'result': re
        })
    ).catch((e) => {
        console.error(e);
            res.status(500).send('Could not warn article')
        }
    );
});

/* ===== GET /{type}/reply ===== */
// article type 에 따른 reply 요청 함수
const replyGetFunctions = {
    penobrol: articleService.getFullReply,
    tandya: articleService.getFullTandyaAnsById,
    youtublog: articleService.getFullYoutublogComById
};
// article의 reply를 요청하는 api
route.get('/:type/reply/:id', (req, res) => {
    const type = req.params['type'];
    const articleId = req.params.id;

    const replyGetFunction = articleService.getFullReplyByArticleId;
    if (replyGetFunction == null)
        res.status(400).send('Wrong article type');
    else replyGetFunction(
        articleId,
        req.session.id2,
        type
    ).then(re =>
        res.json({
            'result': re
        })
    ).catch((e) => {
            console.error(e);
            res.status(500).send('Could not warn article')
        }
    );
});

// article, reply 에 like 요청을 보내기 위한 공용 함수
function __getLikeRequestHandlerFunction(likeFunctions, likeCountFunctions, idString) {
    return (req, res) => {
        const type = req.params['type'];
        const likeFunction = likeFunctions[type];
        const likeCountFunction = likeCountFunctions[type];
        const id = req.body.id;  // TODO unify idString to id
        const clickVal = req.body.cancel;  // TODO refactor to boolean cancel

        if (likeFunction == null)
            res.status(400).send('Wrong article type');
        else likeFunction(
            id,
            req.session.id2,
            clickVal
        ).then(val =>
            likeCountFunction(id).then(count =>
                res.json({
                    'result': count,
                    'button': val
                })
            ).catch(() => res.status(500).send('Cannot load state'))
        ).catch(() => res.status(409).send('Already in like state'));
    }
}

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

route.post('/:type/warn', (req, res) => {
    const type = req.params['type']; // req.params.type
    const articleWarnFunction = articleWarnFunctions[type];
    const articleDidWarnFunction = articleDidWarnFunctions[type];

    if (articleDidWarnFunction == null)
        res.status(400).send("Wrong article type");
    else articleDidWarnFunction(req.session.id2, req.body['warned_id'])
        .then(didWarnArticle => {
            if (!didWarnArticle) {
                articleWarnFunction(req.session.id2, req.body['warned_id'])
                    .then(result => {
                        res.json({
                            'result': result
                        })
                    }).catch(() => res.status(499).send('Cannot load state'));
            } else {
                res.status(409).send('Already Warn');
            }
        }).catch(() => res.status(501).send('Cannot load state'));
});

/* ===== POST /{type}/reply/warn ===== */
// reply type 에 따른 warn 요청 함수
const replyWarnFunctions = {
    penobrol: penobrolService.warnPenobrolCom,
    tandya: tandyaService.warnTandyaAns,
    youtublog: youtublogService.warnYoutublogCom
};

const replyDidWarnFunctions = {
    penobrol: penobrolService.didWarnPenobrolCom,
    tandya: tandyaService.didWarnTandyaAns,
    youtublog: youtublogService.didWarnYoutublogCom
};


route.post('/:type/reply/warn', (req, res) => {
    const type = req.params['type']; // req.params.type
    const replyWarnFunction = replyWarnFunctions[type];
    const replyDidWarnFunction = replyDidWarnFunctions[type];

    if (replyDidWarnFunction == null)
        res.status(400).send("Wrong article type");
    else replyDidWarnFunction(req.session.id2, req.body['warned_id'])
        .then(didWarnreply => {
            if (!didWarnreply) {
                replyWarnFunction(req.session.id2, req.body['warned_id'])
                    .then(result => {
                        res.json({
                            'result': result
                        })
                    }).catch(() => res.status(499).send('Cannot load state'));
            } else {
                res.status(409).send('Already Warn');
            }
        }).catch(() => res.status(501).send('Cannot load state'));
});

/* ===== POST /{type}/re-reply/warn ===== */
// re-reply type 에 따른 warn 요청 함수
const reReplyWarnFunctions = {
    penobrol: penobrolService.warnPenobrolComCom,
    tandya: tandyaService.warnTandyaAnsCom,
    youtublog: youtublogService.warnYoutublogComCom
};

const reReplyDidWarnFunctions = {
    penobrol: penobrolService.didWarnPenobrolComCom,
    tandya: tandyaService.didWarnTandyaAnsCom,
    youtublog: youtublogService.didWarnYoutublogComCom
};


route.post('/:type/re-reply/warn', (req, res) => {
    const type = req.params['type']; // req.params.type
    const reReplyWarnFunction = reReplyWarnFunctions[type];
    const reReplyDidWarnFunction = reReplyDidWarnFunctions[type];

    if (reReplyDidWarnFunction == null)
        res.status(400).send("Wrong article type");
    else reReplyDidWarnFunction(req.session.id2, req.body['warned_id'])
        .then(didWarnReReply => {
            if (!didWarnReReply) {
                reReplyWarnFunction(req.session.id2, req.body['warned_id'])
                    .then(result => {
                        res.json({
                            'result': result
                        })
                    }).catch(() => res.status(499).send('Cannot load state'));
            } else {
                res.status(409).send('Already Warn');
            }
        }).catch(() => res.status(501).send('Cannot load state'));
});


module.exports = route;