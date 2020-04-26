/*
 * Copyright (c) 2020. Created by Seung Joo Noh.
 * All rights reserved.
 */

// url - '/api/warn
const route = require('express').Router();
const jsForBack = require('../back/jsForBack.js');

const warnService = require('../service/warnService');

//**********  Warn **********//
const warnFunctions = {
    article: warnService.warnArticle,
    reply: warnService.warnReply,
    rereply: warnService.warnReReply
};

const didWarnFunctions = {
    article: warnService.didWarnArticle,
    reply: warnService.didWarnReply,
    rereply: warnService.didWarnReReply
};

route.post('/:type/:element',(req, res) => {
    const element = req.params['element']; // req.params.element
    const type = req.params['type']; // req.params.type
    const warnFunction = warnFunctions[element];
    const didWarnFunction = didWarnFunctions[element];

    if (didWarnFunction == null) res.status(400).send('Wrong article type');
    else didWarnFunction(req.session.id2, req.body.warned_id, type)
        .then(didWarn => {
            if (!didWarn) {
                warnFunction(req.session.id2, req.body.warned_id, type)
                    .then(result => {
                        res.json({
                            'result': result
                        })
                    }).catch(() => res.status(499).send('Cannot load state'));
            } else res.status(409).send('Already Warn');
        }).catch(() => res.status(501).send('Cannot load state'));
});

module.exports = route;