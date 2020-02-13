const parser = require('../db/parser.js');
const penobrolDao = require('../db/b-dao/penobrolDao');

/* ===== exports ===== */

exports.getUserPenobrol = async function(id2) {
    const results = await penobrolDao.penobrolByAuthor(id2);
    const parsed = results.map(subject =>
        parser.parseFrontPenobrol(subject)
    );
    return await applyAsyncToAll(parsed, getFullPenobrol);
};

exports.getOrderedPenobrol = async function() {
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
exports.getFullPenobrolById = async function(id) {
    const penobrolResult = (await penobrolDao.penobrolById(id))[0];

    if(penobrolResult == null) return null;

    const penobrol = parser.parsePenobrol(penobrolResult);

    const [commentsResult, likesResult, hashtagsResult] = await Promise.all([
        penobrolDao.penobrolComByScore(id),
        penobrolDao.penobrolLikeById(id),
        penobrolDao.penobrolHashtagById(id)
    ]);

    penobrol.comments = commentsResult.map(parser.parseComment);
    penobrol.likes = likesResult.map(parser.parseTLike);
    penobrol.hashtags = hashtagsResult.map(parser.parseHashtagT);

    penobrol.comments = await applyAsyncToAll(penobrol.comments, getFullComments);
    return penobrol;
};

// penobrol 의 조회수를 올리고 그에 따라 점수를 업데이트 하는 함수
exports.updatePenobrolView = async function(id) {
    // 조회수가 업데이트된 후 점수가 업데이트 돼야 하므로 직렬 처리
    await penobrolDao.updatePenobrolView(id);
    await penobrolDao.updatePenobrolScore(id);
};

// penobrol 와 hashtag 를 post 하고 id를 반환하는 함수
exports.postPenobrol = async function(author, title, content, publicCode, thumbnail, hashtags) {
    const penobrol = await penobrolDao.insertPenobrol(author, title, content, publicCode, thumbnail);
    if(hashtags != null && hashtags.length > 0)
        insertHashtags(penobrol.insertId, hashtags);
    return penobrol.insertId;
};

exports.postComment = async function(p_id, author, comment) {
    const com = await penobrolDao.insertPenobrolCom(author, comment, p_id);
    await penobrolDao.updatePenobrolScore(p_id);
    return com.insertId;
};

exports.postCommentCom = async function(pc_id, author, content) {
    // 결과에 상관 없는 처리이므로 굳이 기다리지 않아도 됨
    penobrolDao.updatePenobrolComScore(pc_id);

    const postCom = await penobrolDao.insertPenobrolComCom(author, content, pc_id);
    return (await penobrolDao.penobrolComComById(postCom.insertId))[0];
};

exports.likePenobrol = async function(p_id, user, val) {
    if(val) await penobrolDao.deletePenobrolLike(p_id, user);
    else await penobrolDao.insertPenobrolLike(p_id, user);
    await penobrolDao.updatePenobrolScore(p_id);
    return Number(!val);
};

exports.penobrolLikeCount = async function(p_id) {
    return (await penobrolDao.penobrolLikeCount(p_id))[0].plikeCount;
};

exports.likePenobrolComment = async function(pc_id, user, val) {
    if(val) await penobrolDao.deletePenobrolComLike(pc_id, user);
    else await penobrolDao.insertPenobrolComLike(pc_id, user);
    await penobrolDao.updatePenobrolComScore(pc_id);
    return Number(!val);
};

exports.penobrolComLikeCount = async function(pc_id) {
    return (await penobrolDao.penobrolComLikeCount(pc_id))[0].pcLikeCount;
};

exports.penobrolLikeCountByAuthor = async function(id2) {
    return (await penobrolDao.penobrolLikeCountByAuthor(id2))[0].total;
};

exports.penobrolComLikeCountByAuthor = async function(id2) {
    return (await penobrolDao.penobrolComLikeCountByAuthor(id2))[0].total;
};

const fs = {
    p: [penobrolDao.penobrolWarnById, penobrolDao.insertPenobrolWarn],
    pc: [penobrolDao.penobrolComWarnById, penobrolDao.insertPenobrolComWarn],
    pcc: [penobrolDao.penobrolComComWarnById, penobrolDao.insertPenobrolComComWarn]
};
exports.warnPenobrol = async function(warnedItem, warnedId, user) {
    const checking = await fs[warnedItem][0](user, warnedId);
    if(checking.length) return 0;
    await fs[warnedItem][1](user, warnedId);
    return 1;
};

exports.editPenobrol = async function(p_id, title, content, publicCode, thumbnail, hashtags) {
    penobrolDao.updatePenobrolDate(p_id);
    penobrolDao.updatePenobrol(title, content, publicCode, thumbnail, p_id);
    await penobrolDao.deletePenobrolHash(p_id);
    if(hashtags != null && hashtags.length > 0)
        await insertHashtags(p_id, hashtags);
    return p_id;
};

exports.getCommentById = async function(pc_id) {
    const commentResult = (await penobrolDao.penobrolComById(pc_id))[0];
    if(commentResult == null) return null;
    return parser.parseComment(commentResult);
};

exports.editComment = async function(pc_id, content, p_id) {
    await penobrolDao.updatePenobrolCom(content, pc_id, p_id);
    return pc_id;
};

exports.deletePenobrol = async function(p_id, u_id) {
    return await deleteProcess(p_id, u_id, penobrolDao.penobrolById, penobrolDao.deletePenobrol);
};

exports.deleteComment = async function(pc_id, u_id) {
    return await deleteProcess(pc_id, u_id, penobrolDao.penobrolComById, penobrolDao.deletePenobrolCom);
};

exports.deleteCComment = async function(pcc_id, u_id) {
    return await deleteProcess(pcc_id, u_id, penobrolDao.penobrolComComById, penobrolDao.deletePenobrolComCom);
};

/* ===== local functions ===== */

// 하나의 penobrol 에 hashtag 와 Comment 개수를 넣어주는 함수
async function getFullPenobrol(penobrol) {
    // hashtag 를 가져오는 작업과 comment 개수를 가져오는 작업을 병렬로 처리
    const [hashtagResult, comCountResult, penobrolLikeCount] = await Promise.all([
        penobrolDao.penobrolHashtagById(penobrol.id),
        penobrolDao.penobrolComCountById(penobrol.id),
        penobrolDao.penobrolLikeCount(penobrol.id)

    ]);
    penobrol.hashtags = hashtagResult.map(parser.parseHashtagP);
    penobrol.commentCount = comCountResult[0].count;
    penobrol.likeCount = penobrolLikeCount[0].plikeCount;
    return penobrol;
}

async function getFullComments(comment) {
    const [commentsResult, likesResult] = await Promise.all([
        penobrolDao.penobrolComComByPcId(comment.id),
        penobrolDao.penobrolComLikeById(comment.id)
    ]);

    comment.comments = commentsResult.map(parser.parseCComment);
    comment.likes = likesResult.map(parser.parseCLike);
    return comment;
}

function insertHashtags(p_id, hashtags) {
    const insertHashtag = (hashtag) => penobrolDao.insertPenobrolHash(p_id, hashtag);
    return applyAsyncToAll(hashtags, insertHashtag);
}

async function deleteProcess(id, u_id, selector, deleter) {
    const p = (await selector(id))[0];
    if(p == null || u_id !== p.author) return false;
    await deleter(id);
    return true;
}

function applyAsyncToAll(list, asyncFun) {
    const promiseList = list.map(item => asyncFun(item));
    return Promise.all(promiseList);
}
