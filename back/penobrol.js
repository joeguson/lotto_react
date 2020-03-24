//url - '/penobrol'
const route = require('express').Router();
const articleService = require('../service/articleService.js');
const penobrolService = require('../service/penobrolService.js');

/************FOR PENOBROL************/
route.get('/', function (req, res) {
    penobrolService.getOrderedPenobrol()
        .then(([dateTopics, scoreTopics]) => res.render('./jp/p', {
            dateTopics: dateTopics,
            scoreTopics: scoreTopics,
            id2: req.session.id2
        }));
});

route.get('/:penobrol_no', function (req, res, next) {
    const id = req.params.penobrol_no;
    const checkId = /^[0-9]+$/;
    if(checkId.test(id)){
        articleService.getFullArticleById(id, req.session.id2, 'penobrol').then(result => {
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
        next();
    }
});

route.get('/new',function (req, res) {
    if (req.session.u_id) {
        res.render('./jp/p-add');
    } else {
        res.redirect('/penobrol/');
    }
});

route.post('/comment/:penobrol_no', function (req, res) {
    const p_id = req.params.penobrol_no;
    penobrolService.postComment(
        p_id,
        req.session.id2,
        req.body.comment
    ).then(() => res.redirect('/penobrol/' + p_id));
});

route.get('/edit/:penobrol_no', function (req, res) {
    const p_id = req.params['penobrol_no'];
    const u_id = req.session.id2;

    articleService.getFullArticleById(p_id, req.session.id2, 'penobrol').then(penobrol => {
        if(penobrol && penobrol.author === u_id)
            res.render('./article_edit', {
                u_id: u_id,
                type: 'penobrol',
                article: penobrol
            });
        else res.redirect('/penobrol/' + p_id);
    });
});

route.get('/edit/comment/:penobrol_no/:pcomment_no',function (req, res) {
    const p_id = req.params.penobrol_no;
    const pc_id = req.params.pcomment_no;
    const u_id = req.session.id2;
    penobrolService.getCommentById(pc_id).then(comment => {
        if (u_id !== comment.author) res.redirect('/comment/view/' + p_id);
        else articleService.getFullArticleById(p_id, req.session.id2, 'penobrol').then(penobrol => {
            res.render('./jp/pc-edit', {
                id2: req.session.id2,
                topic: penobrol,
                edit_content: comment
            });
        });
    });
});

route.put('/comment/:penobrol_no/:pcooment_no',function (req, res) {
    const p_id = req.params.penobrol_no;
    penobrolService.editComment(
        req.params.pcomment_no,
        p_id,
        req.body.comment
    ).then(() => res.redirect('/penobrol/'+ p_id));
});

route.delete('/:id', function(req, res){
    penobrolService.deletePenobrol(
        req.body.deleteId,
        req.session.id2
    ).then(result => {
        if(result) res.json({"result": "deleted"});
        else res.redirect('/penobrol');
    });
});

route.delete('/comment/:id',  function(req, res){
    penobrolService.deleteComment(
        req.body.deleteId,
        req.session.id2
    ).then(result => {
        if(result) res.json({"result": "deleted"});
        else res.redirect('/penobrol/' + req.body.penobrolId);
    });
});

route.delete('/ccomment/:id', function(req, res){
    penobrolService.deleteCComment(
        req.body.deleteId,
        req.session.id2
    ).then(result => {
        if(result) res.json({"result": "deleted"});
        else res.redirect('/penobrol/' + req.body.penobrolId);
    });
});

route.all('*', function(req, res){
    res.redirect('/penobrol');
});

module.exports = route;