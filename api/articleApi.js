// url - '/api/article
const route = require('express').Router();
const jsForBack = require('../back/jsForBack.js');

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
route.post('/:type/like', (req, res) => {
    const type = req.params['type'];
    const likeFunction = articleLikeFunctions[type];
    const likeCountFunction = articleLikeCountFunctions[type];

    const id = req.body.articleId;
    const clickVal = parseInt(req.body.clickVal);  // TODO refactor to boolean cancel

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
                'button': val  // TODO refactor to boolean state
            })
        ).catch(() => res.status(500).send('Cannot load article state'))
    ).catch(() => res.status(409).send('Already in like state'));
});

module.exports = route;