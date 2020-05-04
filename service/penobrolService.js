const parser = require('../db/parser/articleParser.js');
const pccDao = require('../db/b-dao/penDao/pccDao');
const pcDao = require('../db/b-dao/penDao/pcDao');
const pclikeDao = require('../db/b-dao/penDao/pclikeDao');
const phashDao = require('../db/b-dao/penDao/phashDao');
const penobrolDao = require('../db/b-dao/penDao/penobrolDao');
const plikeDao = require('../db/b-dao/penDao/plikeDao');

/* ===== exports ===== */

exports.searchPenobrolByHash = async function (array) {
    let phResults = [];
    for (let h of array) {
        phResults = ((await phashDao.penobrolSearchByHash('%' + h + '%')).reduce((acc, cur) => acc.concat(cur), [])).map(parser.parseFrontPenobrol);
    }
    return await applyAsyncToAll(phResults, getFullPenobrol);
};

exports.getUserPenobrolWithoutAnonim = async function (id2) {
    const results = await penobrolDao.penobrolByAuthorWithoutAnonim(id2);
    const parsed = results.map(subject =>
        parser.parseFrontPenobrol(subject)
    );
    return await applyAsyncToAll(parsed, getFullPenobrol);
};

// penobrol 의 조회수를 올리고 그에 따라 점수를 업데이트 하는 함수
exports.updatePenobrolView = async function (id) {
    // 조회수가 업데이트된 후 점수가 업데이트 돼야 하므로 직렬 처리
    await penobrolDao.updatePenobrolView(id);
    await penobrolDao.updatePenobrolScore(id);
};

// penobrol 와 hashtag 를 post 하고 id를 반환하는 함수
exports.postPenobrol = async function (author, title, content, publicCode, thumbnail, hashtags) {
    const penobrol = await penobrolDao.insertPenobrol(author, title, content, publicCode, thumbnail);
    if (hashtags != null && hashtags.length > 0)
        insertHashtags(penobrol.insertId, hashtags);
    return penobrol.insertId;
};

exports.editPenobrol = async function (p_id, title, content, publicCode, thumbnail, hashtags) {
    penobrolDao.updatePenobrolDate(p_id);
    penobrolDao.updatePenobrol(title, content, publicCode, thumbnail, p_id);
    await phashDao.deletePenobrolHash(p_id);
    if (hashtags != null && hashtags.length > 0)
        await insertHashtags(p_id, hashtags);
    return p_id;
};

exports.editComment = async function (pc_id, content, p_id) {
    await pcDao.updatePenobrolCom(content, pc_id, p_id);
    return pc_id;
};

exports.deletePenobrol = async function (p_id, u_id) {
    return await deleteProcess(p_id, u_id, penobrolDao.penobrolById, penobrolDao.deletePenobrol);
};

exports.deleteComment = async function (pc_id, u_id) {
    return await deleteProcess(pc_id, u_id, pcDao.penobrolComById, pcDao.deletePenobrolCom);
};

exports.deleteCComment = async function (pcc_id, u_id) {
    return await deleteProcess(pcc_id, u_id, pccDao.penobrolComComById, pccDao.deletePenobrolComCom);
};

/* ===== local functions ===== */

// 하나의 penobrol 에 hashtag 와 Comment 개수를 넣어주는 함수
async function getFullPenobrol(penobrol) {
    // hashtag 를 가져오는 작업과 comment 개수를 가져오는 작업을 병렬로 처리
    const [hashtagResult, comCountResult, penobrolLikeCount] = await Promise.all([
        phashDao.penobrolHashtagById(penobrol.id),
        pcDao.penobrolComCountById(penobrol.id),
        plikeDao.penobrolLikeCount(penobrol.id)
    ]);
    penobrol.hashtags = hashtagResult.map(parser.parseHashtagP);
    penobrol.replyCount = comCountResult[0].replyCount;
    penobrol.likeCount = penobrolLikeCount[0].likeCount;

    return penobrol;
}

async function getFullComments(comment) {
    const [commentsResult, likesResult] = await Promise.all([
        pccDao.penobrolComComByPcId(comment.id),
        pclikeDao.penobrolComLikeById(comment.id)
    ]);

    comment.comments = commentsResult.map(parser.parseCComment);
    comment.likes = likesResult.map(parser.parseCLike);
    return comment;
}

function insertHashtags(p_id, hashtags) {
    const insertHashtag = (hashtag) => phashDao.insertPenobrolHash(p_id, hashtag);
    return applyAsyncToAll(hashtags, insertHashtag);
}

async function deleteProcess(id, u_id, selector, deleter) {
    const p = (await selector(id))[0];
    if (p == null || u_id !== p.author) return false;
    await deleter(id);
    return true;
}

function applyAsyncToAll(list, asyncFun) {
    const promiseList = list.map(item => asyncFun(item));
    return Promise.all(promiseList);
}
