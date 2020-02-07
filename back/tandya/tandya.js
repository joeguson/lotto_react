const express = require('express');
const route = express.Router();
const tandyaApi = require('../../api/tandyaApi');
const jsForBack = require('../../back/jsForBack.js');
const tandyaService = require('../../service/tandyaService.js');

/************FOR TANDYA************/

route.get('/', function (req, res) {
    tandyaService.getOrderedTandya()
        .then(([dateTopics, scoreTopics]) => res.render('./jt/t', {
            dateTopics: dateTopics,
            scoreTopics: scoreTopics,
            id2: req.session.id2
        }));
});

route.get('/article/:tandya_no', function (req, res) {
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
});

route.get('/new/article', function (req, res) {
    if (req.session.id2) {
        res.render('./jt/t-add', {id2: req.session.id2});
    } else {
        res.redirect('/tandya/');
    }
});

route.post('/new/article', tandyaApi.postAddTandya);

route.postAddAnswer = function (req, res) {
    const t_id = req.params.tandya_no;
    tandyaService.postAnswer(
        t_id,
        req.session.id2,
        req.body.answer
    ).then(() => res.redirect('/tandya/article/' + t_id));
};

route.post('/new/acomment/:t_id/:ta_id', tandyaApi.postAddAcomment);

route.post('/like/article/:id', tandyaApi.likesTandya);

route.post('/like/answer/:id', tandyaApi.likesAnswer);

route.post('/warn', tandyaApi.warningTandya);

//
// route.getEditTandya = function (req, res) {
//     const t_id = req.params.tandya_no;
//     const u_id = req.session.id2;
//
//     tandyaService.getFullTandyaById(t_id).then(tandya => {
//         if(tandya != null && tandya.author === u_id)
//             res.render('./jt/t-edit', {u_id: u_id, edit_content: tandya});
//         else res.redirect('/tandya/view/' + t_id);
//     });
// };
//
// route.postEditTandya = function (req, res) {
//     tandyaService.editTandya(
//         req.params.tandya_no,
//         req.body.question,
//         req.body.content,
//         req.body.public,
//         req.body.thumbnail,
//         jsForBack.finalHashtagMaker(req.body.hashtag)
//     ).then(t_id => res.json({ "id": t_id }));
// };
//
// route.getEditTanswer = function (req, res) {
//     const t_id = req.params.tandya_no;
//     const ta_id = req.params.tanswer_no;
//     const u_id = req.session.id2;
//
//     tandyaService.getAnswerById(ta_id).then(answer => {
//         if (u_id !== answer.author) res.redirect('/tandya/view/' + t_id);
//         else tandyaService.getFullTandyaById(t_id).then(tandya => {
//             res.render('./jt/ta-edit', {
//                 u_id: 'y',
//                 topic: tandya,
//                 edit_content: answer
//             });
//         });
//     });
// };
//
// route.postEditTanswer = function (req, res) {
//     const t_id = req.params.tandya_no;
//
//     tandyaService.editAnswer(
//         req.params.tanswer_no,
//         t_id,
//         req.body.answer
//     ).then(() => res.redirect('/tandya/'+ t_id));
// };
//
// route.postDeleteTandya = function (req, res) {
//     tandyaService.deleteTandya(
//         req.body.deleteId,
//         req.session.id2
//     ).then(result => {
//         if(result) res.json({"result": "deleted"});
//         else res.redirect('/tandya');
//     });
// };
//
// route.postDeleteTanswer = function (req, res) {
//     tandyaService.deleteAnswer(
//         req.body.deleteId,
//         req.session.id2
//     ).then(result => {
//         if(result) res.json({"result": "deleted"});
//         else res.redirect('/tandya/view/' + req.body.tandyaId);
//     });
// };
//
// route.postDeleteTacomment = function (req, res) {
//     tandyaService.deleteAComment(
//         req.body.deleteId,
//         req.session.id2
//     ).then(result => {
//         if(result) res.json({"result": "deleted"});
//         else res.redirect('/tandya/view/' + req.body.tandyaId);
//     });
// };

module.exports = route;