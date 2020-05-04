/*
 * Copyright (c) 2020. Created by Seung Joo Noh.
 * All rights reserved.
 */

// url - '/api/article
const route = require('express').Router();
const jsForBack = require('../back/jsForBack.js');

const penobrolService = require('../service/penobrolService.js');
const tandyaService = require('../service/tandyaService.js');
const youtublogService = require('../service/youtublogService.js');
const articleService = require('../service/articleService.js');

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
    ).then(id => {
        if (type === 'youtublog') {
            youtublogService.updateYoutube(req.body.youtubes, id)
                .then(count => {
                    res.json({id: id, updatedYoutubes: count});
                }).catch((e) => {
                    console.error(e);
                    res.status(500).send();
                }
            );
        } else res.json({'id': id});
    }).catch(() =>
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
route.put('/:type/:id', (req, res, next) => {
    const type = req.params['type'];
    const editFunction = articleEditFunctions[type];
    const column = req.body[articleMainColumns[type]];
    if(type === 'chosen') next();
    else if (editFunction == null)
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

/* ===== GET /{type}/load===== */
// article type 에 따른 load get 요청 함수
// article 무한스크롤을 요청하는 api
const randArticleFunctions = {
    penobrol: penobrolService.getRandPenobrol,
    tandya: tandyaService.getRandTandya,
    youtublog: youtublogService.getRandYoutublog
};
route.get('/:type/load', (req, res) => {
    const type = req.params['type'];
    articleService.getRandFrontArticle(type)
        .then(([rand]) => {
            res.json(rand);
        })
        .catch(() => res.status(500).send('Could not post re-reply')
    );
});

route.put('/chosen/:type', (req, res) => {
    const type = req.params['type'];
    let articleId = req.body.article_id;
    let preChosen = req.body.pre_chosen;
    let newChosen = req.body.chosen_id;
    if(preChosen === newChosen){ //cancel chosen
        newChosen = null;
    }
    articleService.updateArticleChosen(articleId, newChosen, type)
        .then(() => {
            if(newChosen == null) res.json({result: 'cancel'});
            else res.json({result: 'chosen'});
        })
        .catch(() => {
            res.status(500).send('Could not make chosen');
        });
});

//**********  DELETE **********//

/* ===== DELETE /{type} ===== */
// article type 에 따른 delete 요청 함수
const articleDeleteFunctions = {
    penobrol: penobrolService.deletePenobrol,
    tandya: tandyaService.deleteTandya,
    youtublog: youtublogService.deleteYoutublog
};

route.delete('/:type',
    __getDeleteRequestHandlerFunction(
        articleDeleteFunctions
    )
);

/* ===== DELETE /{type}/reply ===== */
// reply type 에 따른 delete 요청 함수
const replyDeleteFunctions = {
    penobrol: penobrolService.deleteComment,
    tandya: tandyaService.deleteAnswer,
    youtublog: youtublogService.deleteComment
};

route.delete('/:type/reply',
    __getDeleteRequestHandlerFunction(
        replyDeleteFunctions
    )
);

/* ===== DELETE /{type}/re-reply ===== */
// re-reply type 에 따른 delete 요청 함수
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