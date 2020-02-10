//url - '/api/tandya'
const route = require('express').Router();
const jsForBack = require('../back/jsForBack.js');
const tandyaService = require('../service/tandyaService.js');

//************************Tandya************************//

route.post('/', function (req, res) {
    console.log(req);
    tandyaService.postTandya(
        req.session.id2,
        req.body.question,
        req.body.content,
        req.body.public,
        req.body.thumbnail,
        jsForBack.finalHashtagMaker(req.body.hashtag)
    ).then(id => res.send({"id": id}));
});

route.put('/:tandya_no', function (req, res) {
    tandyaService.editTandya(
        req.params.tandya_no,
        req.body.question,
        req.body.content,
        req.body.public,
        req.body.thumbnail,
        jsForBack.finalHashtagMaker(req.body.hashtag)
    ).then(t_id => res.json({ "id": t_id }));
});

//************************Like************************//
route.post('/like', function (req, res, next) {
    const t_id = req.body.t_id;
    tandyaService.likeTandya( //유효한 t_id인지 확인필요
        t_id,
        req.session.id2,
        parseInt(req.body.clickVal)
    ).then(val => {
        tandyaService.tandyaLikeCount(t_id).then(count =>
            res.json({
                "t_like": count,
                "button": val
            })
        );
    });
});

route.post('/like/answer', function (req, res) {
    const ta_id = req.body.ta_id;
    tandyaService.likeTandyaAnswer(//유효한 ta_id인지 확인필요
        ta_id,
        req.session.id2,
        parseInt(req.body.clickVal)
    ).then(val => {
        tandyaService.tandyaAnsLikeCount(ta_id).then(count =>
            res.json({
                "ta_like": count,
                "button": val
            })
        );
    });
});

route.post('/acomment/:t_id/:ta_id', function (req, res) {
    tandyaService.postAnswerCom(
        req.params.ta_id,
        req.session.id2,
        req.body.acommentContent
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
    ).then(result => res.json({ "result": result }));
});


// exports.getOrderedTandya = function(req, res) {
//     tandyaService.getOrderedTandya()
//         .then(([dateTopics, scoreTopics]) => res.json({
//             dateTopics: dateTopics,
//             scoreTopics: scoreTopics
//         }));
// };

module.exports = route;