//articleLike
const plikeDao = require('../db/b-dao/penDao/plikeDao');
const tlikeDao = require('../db/b-dao/tanDao/tlikeDao');
const ylikeDao = require('../db/b-dao/youDao/ylikeDao');
//replyLike
const pclikeDao = require('../db/b-dao/penDao/pclikeDao');
const talikeDao = require('../db/b-dao/tanDao/talikeDao');
const yclikeDao = require('../db/b-dao/youDao/yclikeDao');
//others
const likeParser = require('../db/parser/likeParser.js');

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