//reply
const pcDao = require('../db/b-dao/penDao/pcDao');
const taDao = require('../db/b-dao/tanDao/taDao');
const ycDao = require('../db/b-dao/youDao/ycDao');
//articleServices
const articleService = require('./articleService');
//others
const replyParser = require('../db/parser/replyParser.js');
const serviceUtil = require('./serviceUtil');

const getReplyFunctions = {
    penobrol: pcDao.penobrolComByScore,
    tandya: taDao.tandyaAnsByScore,
    youtublog: ycDao.youtublogComByScore
};
const replyParseFunctions = {
    penobrol: replyParser.parsePenobrolComment,
    tandya: replyParser.parseTandyaAnswer,
    youtublog: replyParser.parseYoutublogComment
};
const countReplyFunctions = {
    penobrol: pcDao.penobrolComCountById,
    tandya: taDao.tandyaAnsCountById,
    youtublog: ycDao.youtublogComCountById
};

exports.countReplyByArticleId = async function (id, type) {
    return (await countReplyFunctions[type](id))[0].replyCount;
};

exports.getFullReply = async function (articleId, userId, type) {
    let replyResult = (await getReplyFunctions[type](articleId))
        .map(replyParseFunctions[type]);

    let reply = await serviceUtil.applyAsyncToAll(type, replyResult, userId, serviceUtil.getReplyDetails);

    return reply;
};

const postReplyFunctions = {
    penobrol: pcDao.insertPenobrolCom,
    tandya: taDao.insertTandyaAns,
    youtublog: ycDao.insertYoutublogCom
};
const getReplyById = {
    penobrol: pcDao.penobrolComById,
    tandya: taDao.tandyaAnsById,
    youtublog: ycDao.youtublogComById
};

exports.postReply = async function (article_id, userId, type, content) {
    const replyResult = await postReplyFunctions[type](userId, content, article_id);
    await articleService.updateArticleScore(article_id, type);
    let reply = (await getReplyById[type](replyResult.insertId)).map(replyParseFunctions[type]);
    reply = await serviceUtil.applyAsyncToAll(type, reply, userId, serviceUtil.getReplyDetails);
    return reply[0];
};

exports.getReplyById = async function(reply_id, type){
    return replyParseFunctions[type]((await getReplyById[type](reply_id))[0]);
};

const updateReplyScoreFunctions = {
    penobrol: pcDao.updatePenobrolComScore,
    tandya: taDao.updateTandyaAnsScore,
    youtublog: ycDao.updateYoutublogComScore
};

exports.updateReplyScore = async function(replyId, type){
    await updateReplyScoreFunctions[type](replyId);
};

const editReplyFunctions = {
    penobrol: pcDao.updatePenobrolCom,
    tandya: taDao.updateTandyaAns,
    youtublog: ycDao.updateYoutublogCom
};

exports.editReply = async function (replyId, content, articleId, type) {
    await editReplyFunctions[type](content, replyId, articleId);
    return replyId;
};