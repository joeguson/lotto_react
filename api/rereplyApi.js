/*
 * Copyright (c) 2020. Created by Seung Joo Noh.
 * All rights reserved.
 */

// url - '/api/rereply
const route = require('express').Router();
const jsForBack = require('../back/jsForBack.js');

const readReReplyService = require('../service/rereplyService');

/* ===== POST /{type}/re-reply ===== */
// article type 에 따른 re-reply post 요청 함수

route.post('/:reply_id', (req, res) => {
    readReReplyService.postReReply(
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


// //**********  Warn **********//
//
// /* ===== POST /{type}/warn ===== */
// // article type 에 따른 warn 요청 함수
// const articleWarnFunctions = {
//     penobrol: penobrolService.warnPenobrol,
//     tandya: tandyaService.warnTandya,
//     youtublog: youtublogService.warnYoutublog
// };
//
// const articleDidWarnFunctions = {
//     penobrol: penobrolService.didWarnPenobrol,
//     tandya: tandyaService.didWarnTandya,
//     youtublog: youtublogService.didWarnYoutublog
// };
//
//
// //**********  DELETE **********//
//
// /* ===== DELETE /{type}/re-reply ===== */
// // re-reply type 에 따른 warn 요청 함수
// const reReplyDeleteFunctions = {
//     penobrol: penobrolService.deleteCComment,
//     tandya: tandyaService.deleteAComment,
//     youtublog: youtublogService.deleteCComment
// };
//
// route.delete('/:type/re-reply',
//     __getDeleteRequestHandlerFunction(
//         reReplyDeleteFunctions
//     )
// );
//
// function __getDeleteRequestHandlerFunction(deleteFunctions) {
//     return (req, res) => {
//         const type = req.params['type']; // req.params.type
//         const deleteFunction = deleteFunctions[type];
//
//         if (deleteFunction == null)
//             res.status(400).send("Wrong article type");
//         deleteFunction(req.body.delete_id, req.session.id2)
//             .then(result => {
//                 res.json({
//                     "result": "deleted"
//                 })
//             }).catch(() => res.status(499).send('Cannot load state'));
//     }
// }


module.exports = route;