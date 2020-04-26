//articleLike
const plikeDao = require('../db/b-dao/penDao/plikeDao');
const tlikeDao = require('../db/b-dao/tanDao/tlikeDao');
const ylikeDao = require('../db/b-dao/youDao/ylikeDao');
//replyLike
const pclikeDao = require('../db/b-dao/penDao/pclikeDao');
const talikeDao = require('../db/b-dao/tanDao/talikeDao');
const yclikeDao = require('../db/b-dao/youDao/yclikeDao');
//readArticleFunctions
const readArticleService = require('./readArticleService');
//readReplyFunctions
const readReplyService = require('./readReplyService');
//others
const componentParser = require('../db/parser/componentParser.js');

const likeStatusFunctions = {
    penobrol: plikeDao.penobrolLikeByAuthor,
    tandya: tlikeDao.tandyaLikeByAuthor,
    youtublog: ylikeDao.youtublogLikeByAuthor
};
const likeCountFunctions = {
    penobrol: plikeDao.penobrolLikeCount,
    tandya: tlikeDao.tandyaLikeCount,
    youtublog: ylikeDao.youtublogLikeCount
};

exports.articleLikeStatus = async function(id, userId, type){
    return (await likeStatusFunctions[type](id, userId))[0].count;
};

exports.articleLikeCount = async function(id, type){
    return (await likeCountFunctions[type](id))[0].likeCount;
};

const replyLikeStatusFunctions = {
    penobrol: pclikeDao.penobrolComLikeByAuthor,
    tandya: talikeDao.tandyaAnsLikeByAuthor,
    youtublog: yclikeDao.youtublogComLikeByAuthor
};
const replyLikeCountFunctions = {
    penobrol: pclikeDao.penobrolComLikeCount,
    tandya: talikeDao.tandyaAnsLikeCount,
    youtublog: yclikeDao.youtublogComLikeCount
};
exports.replyLikeStatus = async function(id, userId, type){
    return (await replyLikeStatusFunctions[type](id, userId))[0].count;
};

exports.replyLikeCount = async function(id, type){
    return (await replyLikeCountFunctions[type](id))[0].likeCount;
};

const likeArticleFunctions = {
    penobrol: plikeDao.insertPenobrolLike,
    tandya: tlikeDao.insertTandyaLike,
    youtublog: ylikeDao.insertYoutublogLike
};
const unlikeArticleFunctions = {
    penobrol: plikeDao.deletePenobrolLike,
    tandya: tlikeDao.deleteTandyaLike,
    youtublog: ylikeDao.deleteYoutublogLike
};

exports.likeArticle = async function (article_id, user, val, type) {
    try {
        if (val) await unlikeArticleFunctions[type](article_id, user);
        else await likeArticleFunctions[type](article_id, user);
        await readArticleService.updateArticleScore(article_id, type);
        return Number(!val);
    } catch (e) {
        return null;
    }
};

const likeReplyFunctions = {
    penobrol: pclikeDao.insertPenobrolComLike,
    tandya: talikeDao.insertTandyaAnsLike,
    youtublog: yclikeDao.insertYoutublogComLike
};
const unlikeReplyFunctions = {
    penobrol: pclikeDao.deletePenobrolComLike,
    tandya: talikeDao.deleteTandyaAnsLike,
    youtublog: yclikeDao.deleteYoutublogComLike
};

exports.likeReply = async function (reply_id, user, val, type) {
    try {
        if (val) await unlikeReplyFunctions[type](reply_id, user);
        else await likeReplyFunctions[type](reply_id, user);
        await readReplyService.updateReplyScore(reply_id, type);
        return Number(!val);
    } catch (e) {
        return null;
    }
};

const articleLikeCountByAuthorFunctions = {
    penobrol: plikeDao.penobrolLikeCountByAuthor,
    tandya: tlikeDao.tandyaLikeCountByAuthor,
    youtublog: ylikeDao.youtublogLikeCountByAuthor
};

exports.articleLikeCountByAuthor = async function (userId, type) {
    return (await articleLikeCountByAuthorFunctions[type](userId))[0].total;
};

const replyLikeCountByAuthorFunctions = {
    penobrol: pclikeDao.penobrolComLikeCountByAuthor,
    tandya: talikeDao.tandyaAnsLikeCountByAuthor,
    youtublog: yclikeDao.youtublogComLikeCountByAuthor
};

exports.replyLikeCountByAuthor = async function (userId, type) {
    return (await replyLikeCountByAuthorFunctions[type](userId))[0].total;
};