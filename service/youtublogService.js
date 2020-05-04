const parser = require('../db/parser/articleParser.js');
const yccDao = require('../db/b-dao/youDao/yccDao');
const ycDao = require('../db/b-dao/youDao/ycDao');
const yclikeDao = require('../db/b-dao/youDao/yclikeDao');
const yhashDao = require('../db/b-dao/youDao/yhashDao');
const youtublogDao = require('../db/b-dao/youDao/youtublogDao');
const ylikeDao = require('../db/b-dao/youDao/ylikeDao');
const youtubeDao = require('../db/b-dao/youDao/youtubeDao');

/* ===== exports ===== */

exports.searchYoutublogByHash = async function (array) {
    let yhResults = [];
    for (let h of array) {
        yhResults = ((await yhashDao.youtublogSearchByHash('%' + h + '%')).reduce((acc, cur) => acc.concat(cur), [])).map(parser.parseFrontYoutublog);
    }
    return await applyAsyncToAll(yhResults, getFullYoutublog);
};

exports.getUserYoutublogWithoutAnonim = async function (id2) {
    const results = await youtublogDao.youtublogByAuthorWithoutAnonim(id2);
    const parsed = results.map(subject =>
        parser.parseFrontYoutublog(subject)
    );
    return await applyAsyncToAll(parsed, getFullYoutublog);
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

exports.editYoutublog = async function (y_id, title, content, publicCode, thumbnail, hashtags) {
    youtublogDao.updateYoutublogDate(y_id);
    youtublogDao.updateYoutublog(title, content, publicCode, thumbnail, y_id);
    await yhashDao.deleteYoutublogHash(y_id);
    if (hashtags != null && hashtags.length > 0)
        await insertHashtags(y_id, hashtags);
    return y_id;
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

exports.getYoutubeById = async function(id) {
    const [sourceResult, timeRowResult] = await Promise.all([
        youtubeDao.selectYoutubeSource(id),
        youtubeDao.selectYoutubeTimeRows(id)
    ]);

    const youtube = sourceResult[0];

    if (youtube == null) return null;

    youtube.timeRows = timeRowResult;
    return youtube;
};

exports.newYoutube = async function(source) {
    if (source == null) return null;
    try {
        return (await youtubeDao.insertYoutubeSource(source))[0];
    } catch (e) {
        console.error(e);
        return null;
    }
};

exports.newYoutubeTimeRows = async function(sourceId, timeRows) {
    if (sourceId == null || timeRows == null) return null;
    return await youtubeDao.insertYoutubeTimeRows(sourceId, timeRows);
};

exports.deleteYoutube = async function(id) {
    if (id == null) return null;
    return (await youtubeDao.deleteYoutubeWithId(id)).affectedRows;
};

exports.updateYoutube = async function(ids, articleId) {
    if (ids == null || articleId == null) return null;
    return (await youtubeDao.updateYoutubeSourceArticleIds(ids, articleId)).affectedRows;
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
    youtublog.replyCount = comCountResult[0].replyCount;
    youtublog.likeCount = youtublogLikeCount[0].likeCount;
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
