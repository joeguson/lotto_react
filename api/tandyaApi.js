const jsForBack = require('../back/jsForBack.js');
const tandyaService = require('../service/tandyaService.js');

exports.postAddTandya = function(req, res) {
    tandyaService.postTandya(
        req.session.id2,
        req.body.question,
        req.body.content,
        req.body.public,
        req.body.thumbnail,
        jsForBack.finalHashtagMaker(req.body.hashtag)
    ).then(id => res.json({"id": id}));
};

exports.postAddAcomment = function (req, res) {
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
};

exports.likesTandya = function (req, res) {
    const t_id = req.body.t_id;
    tandyaService.likeTandya(
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
};

exports.likesAnswer = function (req, res) {
    const ta_id = req.body.ta_id;
    tandyaService.likeTandyaAnswer(
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
};

exports.warningTandya = function (req, res) {
    tandyaService.warnTandya(
        req.body.warnedItem,
        req.body.warnedId,
        req.session.id2
    ).then(result => res.json({ "result": result }));
};

exports.getOrderedTandya = function(req, res) {
    tandyaService.getOrderedTandya()
        .then(([dateTopics, scoreTopics]) => res.json({
            dateTopics: dateTopics,
            scoreTopics: scoreTopics
        }));
};