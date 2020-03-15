//url - '/api/tandya'
const route = require('express').Router();
const tandyaService = require('../service/tandyaService.js');

/* ===== tandya ===== */

route.post('/acomment/:t_id/:ta_id', function (req, res) {
    tandyaService.postAnswerCom(
        req.params.ta_id,
        req.session.id2,
        req.body.pcctacContent
    ).then(com => res.json({
        "acomment_id": com.id,
        "acomment_author": com.u_id,
        "acomment_content": com.content,
        "acomment_date": com.date
    }));
});


//************************Warn************************//
route.post('/warn', function (req, res) {
    tandyaService.warnTandya(
        req.body.warnedItem,
        req.body.warnedId,
        req.session.id2
    ).then(result => res.json({"result": result}));
});


// exports.getOrderedTandya = function(req, res) {
//     tandyaService.getOrderedTandya()
//         .then(([dateTopics, scoreTopics]) => res.json({
//             dateTopics: dateTopics,
//             scoreTopics: scoreTopics
//         }));
// };

module.exports = route;