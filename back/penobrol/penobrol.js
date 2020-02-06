var jsForBack = require('../../back/jsForBack.js');
var penobrolDao = require('../../db/b-dao/penobrolDao');
const penobrolService = require('./penobrolService.js');

/************FOR PENOBROL************/
exports.getPenobrol = function (req, res) {
    penobrolService.getOrderedPenobrol()
        .then(([dateTopics, scoreTopics]) => res.render('./jp/p', {
            dateTopics: dateTopics,
            scoreTopics: scoreTopics,
            id2: req.session.id2
        }));
};

exports.getViewPenobrol = function (req, res) {
    const id = req.params.penobrol_no;
    const checkId = /^[0-9]+$/;
    if(checkId.test(id)){
        penobrolService.getFullPenobrolById(id).then(result => {
            if (!result) res.redirect('/penobrol/'); // 결과가 없으면 홈으로 이동
            else penobrolService.updatePenobrolView(result.id).then(() => // 받아왔으면 조회수 증가 후 페이지 표시
                res.render('./jp/p-view', {
                    topic: result,
                    u_id: req.session.u_id,
                    id2: req.session.id2,
                })
            );
        });
    }
    else{
        res.redirect('/penobrol/');
    }
};

exports.getAddPenobrol = function (req, res) {
    if (req.session.u_id) {
        res.render('./jp/p-add');
    } else {
        res.redirect('/penobrol/');
    }
};

exports.postAddPenobrol = function (req, res) {
    penobrolService.postPenobrol(
        req.session.id2,
        req.body.title,
        req.body.content,
        req.body.public,
        req.body.thumbnail,
        jsForBack.finalHashtagMaker(req.body.hashtag)
    ).then(id => res.json({"id": id}));
};

exports.postAddComment = function (req, res) {
    const p_id = req.params.penobrol_no;
    penobrolService.postComment(
        p_id,
        req.session.id2,
        req.body.comment
    ).then(() => res.redirect('/penobrol/view/' + p_id));
};

exports.postAddCcomment = function (req, res) {
    penobrolService.postCommentCom(
        req.params.pc_id,
        req.session.id2,
        req.body.ccommentContent
    ).then(com => res.json({
        "ccomment_id": com.id,
        "ccomment_author": com.u_id,
        "ccomment_content": com.content,
        "ccomment_date": com.date
    }));
};

exports.likesPenobrol = function (req, res) {
    const p_id = req.body.p_id;
    penobrolService.likePenobrol(
        p_id,
        req.session.id2,
        parseInt(req.body.clickVal)
    ).then(val => {
        penobrolService.penobrolLikeCount(p_id).then(count =>
            res.json({
                "p_like": count,
                "button": val
            })
        );
    });
};

exports.likesComment = function (req, res) {
    const pc_id = req.body.pc_id;
    penobrolService.likePenobrolComment(
        pc_id,
        req.session.id2,
        parseInt(req.body.clickVal)
    ).then(val => {
        penobrolService.PenobrolComLikeCount(pc_id).then(count =>
            res.json({
                "pc_like": count,
                "button": val
            })
        );
    });
};

exports.warningPenobrol = function (req, res) {
    penobrolService.warnPenobrol(
        req.body.warnedItem,
        req.body.warnedId,
        req.session.id2
    ).then(result => res.json({ "result": result }));
};

exports.getEditPenobrol = function (req, res) {
    const p_id = req.params.penobrol_no;
    const u_id = req.session.id2;

    penobrolService.getFullPenobrolById(p_id).then(penobrol => {
        if(penobrol != null && penobrol.author === u_id)
            res.render('./jp/p-edit', {u_id: u_id, edit_content: penobrol});
        else res.redirect('/penobrol/view/' + p_id);
    });
};

exports.postEditPenobrol = function (req, res) {
    penobrolService.editPenobrol(
        req.params.penobrol_no,
        req.body.title,
        req.body.content,
        req.body.public,
        req.body.thumbnail,
        jsForBack.finalHashtagMaker(req.body.hashtag)
    ).then(p_id => res.json({ "id": p_id }));
};

exports.getEditPcomment = function (req, res) {
    const p_id = req.params.penobrol_no;
    const pc_id = req.params.pcomment_no;
    const u_id = req.session.id2;

    penobrolService.getCommentById(pc_id).then(comment => {
        if (u_id !== comment.author) res.redirect('/comment/view/' + p_id);
        else penobrolService.getFullPenobrolById(p_id).then(penobrol => {
            res.render('./jp/pc-edit', {
                u_id: 'y',
                topic: penobrol,
                edit_content: comment
            });
        });
    });
};

exports.postEditPcomment = function (req, res) {
    const p_id = req.params.penobrol_no;

    penobrolService.editComment(
        req.params.pcomment_no,
        p_id,
        req.body.comment
    ).then(() => res.redirect('/penobrol/'+ p_id));
};

exports.postDeletePenobrol = function(req, res){
    penobrolService.deletePenobrol(
        req.body.deleteId,
        req.session.id2
    ).then(result => {
        if(result) res.json({"result": "deleted"});
        else res.redirect('/penobrol');
    });
};

exports.postDeletePcomment = function(req, res){
    penobrolService.deleteComment(
        req.body.deleteId,
        req.session.id2
    ).then(result => {
        if(result) res.json({"result": "deleted"});
        else res.redirect('/penobrol/view/' + req.body.penobrolId);
    });
};

exports.postDeletePccomment = function(req, res){
    penobrolService.deleteCComment(
        req.body.deleteId,
        req.session.id2
    ).then(result => {
        if(result) res.json({"result": "deleted"});
        else res.redirect('/penobrol/view/' + req.body.penobrolId);
    });
    var deleteId = req.body.deleteId;
    var p_id = req.body.penobrolId;
    async function deletePenobrolComCom(){
        var checkAuthor = await penobrolDao.penobrolComComById(deleteId);
        if(checkAuthor[0].author === req.session.id2){
            await penobrolDao.deletePenobrolComCom(deleteId);
            res.json({"result":"deleted"});
        }
        else{
            res.redirect('/penobrol/view/'+ p_id);
        }
    }
    deletePenobrolComCom();
};
