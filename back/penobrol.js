//url - '/penobrol'
const route = require('express').Router();
const articleService = require('../service/articleService.js');
const replyService = require('../service/replyService.js');

/* ===== penobrol ===== */
route.get('/', function (req, res) {
    articleService.getFrontArticle('penobrol')
        .then(([results]) => {
            res.render('./jp/p', {
            topics: results,
            id2: req.session.id2 ? req.session.id2 : 0
            })}
        );
});

route.get('/:penobrol_no', function (req, res, next) {
    // 로그인 정보를 가지고 가는경우 없는경우
    const id = req.params.penobrol_no;
    const checkId = /^[0-9]+$/;
    if(checkId.test(id)){
        articleService.getFullArticleById(id, req.session.id2, 'penobrol').then(result => {
            if (!result) res.redirect('/penobrol/'); // 결과가 없으면 홈으로 이동
            else articleService.updateViewArticle(result.id, 'penobrol').then(() => // 받아왔으면 조회수 증가 후 페이지 표시
                res.render('./jp/p-view', {
                    topic: result,
                    u_id: req.session.u_id,
                    id2: req.session.id2 ? req.session.id2 : 0
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

route.get('/edit/:penobrol_no', function (req, res) {
    const p_id = req.params['penobrol_no'];
    const u_id = req.session.id2;

    articleService.getFullArticleById(p_id, req.session.id2, 'penobrol').then(penobrol => {
        if(penobrol && penobrol.author === u_id)
            res.render('./edit_layout', {
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
    replyService.getReplyById(pc_id, 'penobrol').then(comment => {
        if (u_id !== comment.author) res.redirect('/comment/view/' + p_id);
        else articleService.getFullArticleById(p_id, req.session.id2, 'penobrol').then(penobrol => {
            res.render('./jp/pc-edit', {
                id2: req.session.id2 ? req.session.id2 : 0,
                topic: penobrol,
                edit_content: comment
            });
        });
    });
});

route.all('*', function(req, res){
    res.redirect('/penobrol');
});

module.exports = route;