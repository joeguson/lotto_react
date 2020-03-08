//url - '/api/samusil'
const route = require('express').Router();
const jsForBack = require('../back/jsForBack.js');
const youtublogService = require('../service/youtublogService.js');

/* ===== samusil ===== */

// route.post('/', function (req, res) {
//     penobrolService.postCommentCom(
//         req.params.pc_id,
//         req.session.id2,
//         req.body.pcctacContent
//     ).then(com => res.json({
//         "ccomment_id": com.id,
//         "ccomment_author": com.u_id,
//         "ccomment_content": com.content,
//         "ccomment_date": com.date
//     }));
// });

module.exports = route;