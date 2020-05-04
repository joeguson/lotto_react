//reply
const pcDao = require('../db/b-dao/penDao/pcDao');
const taDao = require('../db/b-dao/tanDao/taDao');
const ycDao = require('../db/b-dao/youDao/ycDao');
//articleServices
const articleService = require('./articleService');
//rereplyServices
const rereplyService = require('./rereplyService');
//likeServices
const likeService = require('./likeService');
//others
const replyParser = require('../db/parser/replyParser.js');

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

    let reply = await applyAsyncToAll(type, replyResult, userId, getReplyDetails);

    return reply;
};

async function getReplyDetails(type, userId, item) {
    const [re_replyResult, likeStatus, likeCount] = await Promise.all([
        rereplyService.getFullReReply(item.id, type),
        likeService.replyLikeStatus(item.id, userId, type),
        likeService.replyLikeCount(item.id, type),
    ]);
    item.comments = re_replyResult;
    item.likeStatus = likeStatus;
    item.likeCount = likeCount;

    return item;
}

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
    reply = await applyAsyncToAll(type, reply, userId, getReplyDetails);
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

function applyAsyncToAll(type, list, userId, asyncFun) {
    const promiseList = list.map(item => asyncFun(type, userId, item));
    return Promise.all(promiseList);
}