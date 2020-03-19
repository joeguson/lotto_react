const parser = require('../db/parser.js');
const yccDao = require('../db/b-dao/youDao/yccDao');
const ycDao = require('../db/b-dao/youDao/ycDao');
const yclikeDao = require('../db/b-dao/youDao/yclikeDao');
const yhashDao = require('../db/b-dao/youDao/yhashDao');
const youtublogDao = require('../db/b-dao/youDao/youtublogDao');
const ylikeDao = require('../db/b-dao/youDao/ylikeDao');
const warningDao = require('../db/b-dao/warningDao');

/* ===== exports ===== */

exports.searchYoutublog = async function (string) {
    const results = await youtublogDao.youtublogSearch(string);
    const parsed = results.map(subject =>
        parser.parseFrontYoutublog(subject)
    );
    return await applyAsyncToAll(parsed, getFullYoutublog);
};

exports.searchYoutublogByHash = async function (array) {
    let yhResults = [];
    for (let h of array) {
        yhResults = ((await yhashDao.youtublogSearchByHash('%' + h + '%')).reduce((acc, cur) => acc.concat(cur), [])).map(parser.parseFrontYoutublog);
    }
    return await applyAsyncToAll(yhResults, getFullYoutublog);
};

exports.getRandYoutublog = async function () {
    const results = await youtublogDao.youtublogByRand();
    const parsed = results.map(subject =>
        parser.parseFrontYoutublog(subject)
    );
    return await applyAsyncToAll(parsed, getFullYoutublog);
};

exports.getUserYoutublog = async function (id2) {
    const results = await youtublogDao.youtublogByAuthor(id2);
    const parsed = results.map(subject =>
        parser.parseFrontYoutublog(subject)
    );
    return await applyAsyncToAll(parsed, getFullYoutublog);
};

exports.getUserYoutublogWithoutAnonim = async function (id2) {
    const results = await youtublogDao.youtublogByAuthorWithoutAnonim(id2);
    const parsed = results.map(subject =>
        parser.parseFrontYoutublog(subject)
    );
    return await applyAsyncToAll(parsed, getFullYoutublog);
};

exports.getOrderedYoutublog = async function () {
    // date, score 기준으로 youtublog 를 받아오는 것을 병렬로 처리
    const results = await Promise.all([
        youtublogDao.youtublogByDate(),
        youtublogDao.youtublogByScore()
    ]);
    // byDate, byScore 를 youtublog 객체로 변환
    const parsed = results.map(subject =>
        subject.map(parser.parseFrontYoutublog)
    );
    // byDate, byScore 에 있는 youtublog 들에게 hashtag 와 comment 개수를 넣어줌
    return await Promise.all(parsed.map((list) => applyAsyncToAll(list, getFullYoutublog)));
};

exports.getFullYoutublogComById = async function(id, userId) {
    const youtublogComResult = (await ycDao.youtublogComByScore(id)).map(parser.parseComment);
    if(youtublogComResult == null) return null;
    const youtublogComResultWithReply = await applyAsyncToAll(youtublogComResult, getFullComments);
    return youtublogComResultWithReply;
};

// youtublog 의 조회수를 올리고 그에 따라 점수를 업데이트 하는 함수
exports.updateYoutublogView = async function (id) {
    // 조회수가 업데이트된 후 점수가 업데이트 돼야 하므로 직렬 처리
    await youtublogDao.updateYoutublogView(id);
    await youtublogDao.updateYoutublogScore(id);
};

// youtublog 와 hashtag 를 post 하고 id를 반환하는 함수
exports.postYoutublog = async function (author, title, content, publicCode, thumbnail, hashtags) {
    const youtublog = await youtublogDao.insertYoutublog(author, title, content, publicCode, thumbnail);
    if (hashtags != null && hashtags.length > 0)
        insertHashtags(youtublog.insertId, hashtags);
    return youtublog.insertId;
};

exports.postComment = async function (y_id, author, comment) {
    const com = await ycDao.insertYoutublogCom(author, comment, y_id);
    await youtublogDao.updateYoutublogScore(y_id);
    return com.insertId;
};

exports.postCommentCom = async function (yc_id, author, content) {
    // 결과에 상관 없는 처리이므로 굳이 기다리지 않아도 됨
    ycDao.updateYoutublogComScore(yc_id);

    const postCom = await yccDao.insertYoutublogComCom(author, content, yc_id);
    return (await yccDao.youtublogComComById(postCom.insertId))[0];
};

exports.likeYoutublog = async function (y_id, user, val) {
    if (val) await ylikeDao.deleteYoutublogLike(y_id, user);
    else await ylikeDao.insertYoutublogLike(y_id, user);
    await youtublogDao.updateYoutublogScore(y_id);
    return Number(!val);
};

exports.youtublogLikeCount = async function (y_id) {
    return (await ylikeDao.youtublogLikeCount(y_id))[0].ylikeCount;
};

exports.likeYoutublogComment = async function (yc_id, user, val) {
    if (val) await yclikeDao.deleteYoutublogComLike(yc_id, user);
    else await yclikeDao.insertYoutublogComLike(yc_id, user);
    await ycDao.updateYoutublogComScore(yc_id);
    return Number(!val);
};

exports.youtublogComLikeCount = async function (yc_id) {
    return (await yclikeDao.youtublogComLikeCount(yc_id))[0].ycLikeCount;
};

exports.youtublogLikeCountByAuthor = async function (id2) {
    return (await ylikeDao.youtublogLikeCountByAuthor(id2))[0].total;
};

exports.youtublogComLikeCountByAuthor = async function (id2) {
    return (await yclikeDao.youtublogComLikeCountByAuthor(id2))[0].total;
};

exports.editYoutublog = async function (y_id, title, content, publicCode, thumbnail, hashtags) {
    youtublogDao.updateYoutublogDate(y_id);
    youtublogDao.updateYoutublog(title, content, publicCode, thumbnail, y_id);
    await yhashDao.deleteYoutublogHash(y_id);
    if (hashtags != null && hashtags.length > 0)
        await insertHashtags(y_id, hashtags);
    return y_id;
};

exports.getCommentById = async function (yc_id) {
    const commentResult = (await ycDao.youtublogComById(yc_id))[0];
    if (commentResult == null) return null;
    return parser.parseComment(commentResult);
};

exports.editComment = async function (yc_id, content, y_id) {
    await ycDao.updateYoutublogCom(content, yc_id, y_id);
    return yc_id;
};

exports.deleteYoutublog = async function (y_id, u_id) {
    return await deleteProcess(y_id, u_id, youtublogDao.youtublogById, youtublogDao.deleteYoutublog);
};

exports.deleteComment = async function (yc_id, u_id) {
    return await deleteProcess(yc_id, u_id, ycDao.youtublogComById, ycDao.deleteYoutublogCom);
};

exports.deleteCComment = async function (ycc_id, u_id) {
    return await deleteProcess(ycc_id, u_id, yccDao.youtublogComComById, yccDao.deleteYoutublogComCom);
};

exports.warnYoutublog = async function (u_id, warned_id) {
    return await warningDao.insertYoutublogWarning(u_id, warned_id);
};

exports.warnYoutublogCom = async function (u_id, warned_id) {
    return await warningDao.insertYoutublogComWarning(u_id, warned_id);
};

exports.warnYoutublogComCom = async function (u_id, warned_id) {
    return await warningDao.insertYoutublogComComWarning(u_id, warned_id);
};

exports.didWarnYoutublog = async function(u_id, warned_id) {
    return (await warningDao.countYoutublogWarning(u_id, warned_id)) > 0;
};

exports.didWarnYoutublogCom = async function(u_id, warned_id) {
    return (await warningDao.countYoutublogComWarning(u_id, warned_id)) > 0;
};

exports.didWarnYoutublogComCom = async function(u_id, warned_id) {
    return (await warningDao.countYoutublogComComWarning(u_id, warned_id)) > 0;
};

/* ===== local functions ===== */

// 하나의 youtublog 에 hashtag 와 Comment 개수를 넣어주는 함수
async function getFullYoutublog(youtublog) {
    // hashtag 를 가져오는 작업과 comment 개수를 가져오는 작업을 병렬로 처리
    const [hashtagResult, comCountResult, youtublogLikeCount] = await Promise.all([
        yhashDao.youtublogHashtagById(youtublog.id),
        ycDao.youtublogComCountById(youtublog.id),
        ylikeDao.youtublogLikeCount(youtublog.id)

    ]);
    youtublog.hashtags = hashtagResult.map(parser.parseHashtagY);
    youtublog.commentCount = comCountResult[0].count;
    youtublog.likeCount = youtublogLikeCount[0].ylikeCount;
    return youtublog;
}

async function getFullComments(comment) {
    const [commentsResult, likesResult] = await Promise.all([
        yccDao.youtublogComComByYcId(comment.id),
        yclikeDao.youtublogComLikeById(comment.id)
    ]);

    comment.comments = commentsResult.map(parser.parseCComment);
    comment.likes = likesResult.map(parser.parseCLike);
    return comment;
}

function insertHashtags(y_id, hashtags) {
    const insertHashtag = (hashtag) => yhashDao.insertYoutublogHash(y_id, hashtag);
    return applyAsyncToAll(hashtags, insertHashtag);
}

async function deleteProcess(id, u_id, selector, deleter) {
    const y = (await selector(id))[0];
    if (y == null || u_id !== y.author) return false;
    await deleter(id);
    return true;
}

function applyAsyncToAll(list, asyncFun) {
    const promiseList = list.map(item => asyncFun(item));
    return Promise.all(promiseList);
}
