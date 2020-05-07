const parser = require('../db/parser/articleParser.js');
const ycDao = require('../db/b-dao/youDao/ycDao');
const yhashDao = require('../db/b-dao/youDao/yhashDao');
const youtublogDao = require('../db/b-dao/youDao/youtublogDao');
const ylikeDao = require('../db/b-dao/youDao/ylikeDao');
const youtubeDao = require('../db/b-dao/youDao/youtubeDao');

/* ===== exports ===== */

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
    if (ids.length === 0 || articleId == null) return null;
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

function applyAsyncToAll(list, asyncFun) {
    const promiseList = list.map(item => asyncFun(item));
    return Promise.all(promiseList);
}
