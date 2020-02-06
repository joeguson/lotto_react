const jsForBack = require('../../back/jsForBack.js');
const tandyaService = require('./tandyaService.js');

/************FOR TANDYA************/

exports.getTandya = function (req, res) {
    tandyaService.getOrderedTandya()
        .then(([dateTopics, scoreTopics]) => res.render('./jt/t', {
            dateTopics: dateTopics,
            scoreTopics: scoreTopics,
            id2: req.session.id2
        }));
};

exports.getViewTandya = function (req, res) {
    const id = req.params.tandya_no;
    const checkId = /^[0-9]+$/;
    if (checkId.test(id)) {
        tandyaService.getFullTandyaById(id).then(result => {
            if (!result) res.redirect('/tandya/'); // 결과가 없으면 홈으로 이동
            else tandyaService.updateTandyaView(result.id).then(() => // 받아왔으면 조회수 증가 후 페이지 표시
                res.render('./jt/t-view', {
                    topic: result,
                    u_id: req.session.u_id,
                    id2: req.session.id2,
                })
            );
        });
    }
    else {
        res.redirect('/tandya/');
    }
};

exports.getAddTandya = function (req, res) {
    if (req.session.id2) {
        res.render('./jt/t-add', {id2: req.session.id2});
    } else {
        res.redirect('/tandya/');
    }
};

exports.postAddTandya = function (req, res) {
    tandyaService.postTandya(
        req.session.id2,
        req.body.question,
        req.body.content,
        req.body.public,
        req.body.thumbnail,
        jsForBack.finalHashtagMaker(req.body.hashtag)
    ).then(id => res.json({"id": id}));
};

exports.postAddAnswer = function (req, res) {
    const t_id = req.params.tandya_no;
    tandyaService.postAnswer(
        t_id,
        req.session.id2,
        req.body.answer
    ).then(() => res.redirect('/tandya/view/' + t_id));
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

exports.getEditTandya = function (req, res) {
    const t_id = req.params.tandya_no;
    const u_id = req.session.id2;

    tandyaService.getFullTandyaById(t_id).then(tandya => {
        if(tandya != null && tandya.author === u_id)
            res.render('./jt/t-edit', {u_id: u_id, edit_content: tandya});
        else res.redirect('/tandya/view/' + t_id);
    });
};

exports.postEditTandya = function (req, res) {
    tandyaService.editTandya(
        req.params.tandya_no,
        req.body.question,
        req.body.content,
        req.body.public,
        req.body.thumbnail,
        jsForBack.finalHashtagMaker(req.body.hashtag)
    ).then(t_id => res.json({ "id": t_id }));
};

exports.getEditTanswer = function (req, res) {
    const t_id = req.params.tandya_no;
    const ta_id = req.params.tanswer_no;
    const u_id = req.session.id2;

    tandyaService.getAnswerById(ta_id).then(answer => {
        if (u_id !== answer.author) res.redirect('/tandya/view/' + t_id);
        else tandyaService.getFullTandyaById(t_id).then(tandya => {
            res.render('./jt/ta-edit', {
                u_id: 'y',
                topic: tandya,
                edit_content: answer
            });
        });
    });
};

exports.postEditTanswer = function (req, res) {
    const t_id = req.params.tandya_no;

    tandyaService.editAnswer(
        req.params.tanswer_no,
        t_id,
        req.body.answer
    ).then(() => res.redirect('/tandya/'+ t_id));
};

exports.postDeleteTandya = function (req, res) {
    tandyaService.deleteTandya(
        req.body.deleteId,
        req.session.id2
    ).then(result => {
        if(result) res.json({"result": "deleted"});
        else res.redirect('/tandya');
    });
};

exports.postDeleteTanswer = function (req, res) {
    tandyaService.deleteAnswer(
        req.body.deleteId,
        req.session.id2
    ).then(result => {
        if(result) res.json({"result": "deleted"});
        else res.redirect('/tandya/view/' + req.body.tandyaId);
    });
};

exports.postDeleteTacomment = function (req, res) {
    tandyaService.deleteAComment(
        req.body.deleteId,
        req.session.id2
    ).then(result => {
        if(result) res.json({"result": "deleted"});
        else res.redirect('/tandya/view/' + req.body.tandyaId);
    });
};
