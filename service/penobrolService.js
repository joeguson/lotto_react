const parser = require('../db/parser.js');
const pccDao = require('../db/b-dao/penDao/pccDao');
const pcDao = require('../db/b-dao/penDao/pcDao');
const pclikeDao = require('../db/b-dao/penDao/pclikeDao');
const phashDao = require('../db/b-dao/penDao/phashDao');
const penobrolDao = require('../db/b-dao/penDao/penobrolDao');
const plikeDao = require('../db/b-dao/penDao/plikeDao');
const warningDao = require('../db/b-dao/warningDao');

/* ===== exports ===== */

exports.searchPenobrol = async function (string) {
    const results = await penobrolDao.penobrolSearch(string);
    const parsed = results.map(subject =>
        parser.parseFrontPenobrol(subject)
    );
    return await applyAsyncToAll(parsed, getFullPenobrol);
};

exports.searchPenobrolByHash = async function (array) {
    let phResults = [];
    for (let h of array) {
        phResults = ((await phashDao.penobrolSearchByHash('%' + h + '%')).reduce((acc, cur) => acc.concat(cur), [])).map(parser.parseFrontPenobrol);
    }
    return await applyAsyncToAll(phResults, getFullPenobrol);
};

exports.getRandPenobrol = async function () {
    const results = await penobrolDao.penobrolByRand();
    const parsed = results.map(subject =>
        parser.parseFrontPenobrol(subject)
    );
    return await applyAsyncToAll(parsed, getFullPenobrol);
};

exports.getUserPenobrol = async function (id2) {
    const results = await penobrolDao.penobrolByAuthor(id2);
    const parsed = results.map(subject =>
        parser.parseFrontPenobrol(subject)
    );
    return await applyAsyncToAll(parsed, getFullPenobrol);
};

exports.getUserPenobrolWithoutAnonim = async function (id2) {
    const results = await penobrolDao.penobrolByAuthorWithoutAnonim(id2);
    const parsed = results.map(subject =>
        parser.parseFrontPenobrol(subject)
    );
    return await applyAsyncToAll(parsed, getFullPenobrol);
};

exports.getOrderedPenobrol = async function () {
    // date, score 기준으로 penobrol 를 받아오는 것을 병렬로 처리
    const results = await Promise.all([
        penobrolDao.penobrolByDate(),
        penobrolDao.penobrolByScore()
    ]);
    // byDate, byScore 를 penobrol 객체로 변환
    const parsed = results.map(subject =>
        subject.map(parser.parseFrontPenobrol)
    );
    // byDate, byScore 에 있는 penobrol 들에게 hashtag 와 comment 개수를 넣어줌
    return await Promise.all(parsed.map((list) => applyAsyncToAll(list, getFullPenobrol)));
};

// penobrol id 로 penobrol 관련된 모든 정보를 읽어오는 함수
exports.getFullPenobrolById = async function (id) {
    const penobrolResult = (await penobrolDao.penobrolById(id))[0];

    if (penobrolResult == null) return null;

    const penobrol = parser.parsePenobrol(penobrolResult);

    const [commentsResult, likesResult, hashtagsResult] = await Promise.all([
        pcDao.penobrolComByScore(id),
        plikeDao.penobrolLikeById(id),
        phashDao.penobrolHashtagById(id)
    ]);

    penobrol.comments = commentsResult.map(parser.parseComment);
    penobrol.likes = likesResult.map(parser.parsePLike);
    penobrol.hashtags = hashtagsResult.map(parser.parseHashtagP);

    penobrol.comments = await applyAsyncToAll(penobrol.comments, getFullComments);
    return penobrol;
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

exports.postComment = async function (p_id, author, comment) {
    const com = await pcDao.insertPenobrolCom(author, comment, p_id);
    await penobrolDao.updatePenobrolScore(p_id);
    return com.insertId;
};

exports.postCommentCom = async function (pc_id, author, content) {
    // 결과에 상관 없는 처리이므로 굳이 기다리지 않아도 됨
    pcDao.updatePenobrolComScore(pc_id);

    const postCom = await pccDao.insertPenobrolComCom(author, content, pc_id);
    return (await pccDao.penobrolComComById(postCom.insertId))[0];
};

exports.likePenobrol = async function (p_id, user, val) {
    try {
        if (val) await plikeDao.deletePenobrolLike(p_id, user);
        else await plikeDao.insertPenobrolLike(p_id, user);
        await penobrolDao.updatePenobrolScore(p_id);
        return Number(!val);
    } catch (e) {
        return null;
    }
};

exports.penobrolLikeCount = async function (p_id) {
    return (await plikeDao.penobrolLikeCount(p_id))[0].plikeCount;
};

exports.likePenobrolComment = async function (pc_id, user, val) {
    if (val) await pclikeDao.deletePenobrolComLike(pc_id, user);
    else await pclikeDao.insertPenobrolComLike(pc_id, user);
    await pcDao.updatePenobrolComScore(pc_id);
    return Number(!val);
};

exports.penobrolComLikeCount = async function (pc_id) {
    return (await pclikeDao.penobrolComLikeCount(pc_id))[0].pcLikeCount;
};

exports.penobrolLikeCountByAuthor = async function (id2) {
    return (await plikeDao.penobrolLikeCountByAuthor(id2))[0].total;
};

exports.penobrolComLikeCountByAuthor = async function (id2) {
    return (await pclikeDao.penobrolComLikeCountByAuthor(id2))[0].total;
};

exports.editPenobrol = async function (p_id, title, content, publicCode, thumbnail, hashtags) {
    penobrolDao.updatePenobrolDate(p_id);
    penobrolDao.updatePenobrol(title, content, publicCode, thumbnail, p_id);
    await phashDao.deletePenobrolHash(p_id);
    if (hashtags != null && hashtags.length > 0)
        await insertHashtags(p_id, hashtags);
    return p_id;
};

exports.getCommentById = async function (pc_id) {
    const commentResult = (await pcDao.penobrolComById(pc_id))[0];
    if (commentResult == null) return null;
    return parser.parseComment(commentResult);
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

exports.warnPenobrol = async function (u_id, warned_id) {
    return await warningDao.insertPenobrolWarning(u_id, warned_id);
};

exports.warnPenobrolCom = async function (u_id, warned_id) {
    return await warningDao.insertPenobrolComWarning(u_id, warned_id);
};

exports.warnPenobrolComCom = async function (u_id, warned_id) {
    return await warningDao.insertPenobrolComComWarning(u_id, warned_id);
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
    penobrol.commentCount = comCountResult[0].count;
    penobrol.likeCount = penobrolLikeCount[0].plikeCount;
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
