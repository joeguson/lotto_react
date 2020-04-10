//article
const penobrolDao = require('../db/b-dao/penDao/penobrolDao');
const tandyaDao = require('../db/b-dao/tanDao/tandyaDao');
const youtublogDao = require('../db/b-dao/youDao/youtublogDao');
//reply
const pcDao = require('../db/b-dao/penDao/pcDao');
const taDao = require('../db/b-dao/tanDao/taDao');
const ycDao = require('../db/b-dao/youDao/ycDao');
//re_reply
const pccDao = require('../db/b-dao/penDao/pccDao');
const tacDao = require('../db/b-dao/tanDao/tacDao');
const yccDao = require('../db/b-dao/youDao/yccDao');
//articleLike
const plikeDao = require('../db/b-dao/penDao/plikeDao');
const tlikeDao = require('../db/b-dao/tanDao/tlikeDao');
const ylikeDao = require('../db/b-dao/youDao/ylikeDao');
//replyLike
const pclikeDao = require('../db/b-dao/penDao/pclikeDao');
const talikeDao = require('../db/b-dao/tanDao/talikeDao');
const yclikeDao = require('../db/b-dao/youDao/yclikeDao');
//hashtags
const phashDao = require('../db/b-dao/penDao/phashDao');
const thashDao = require('../db/b-dao/tanDao/thashDao');
const yhashDao = require('../db/b-dao/youDao/yhashDao');
//others
const parser = require('../db/parser.js');
const warningDao = require('../db/b-dao/warningDao');

const getFullArticleFunctions = {
    penobrol: penobrolDao.penobrolById,
    tandya: tandyaDao.tandyaById,
    youtublog: youtublogDao.youtublogById
};
const articleParseFunctions = {
    penobrol: parser.parsePenobrol,
    tandya: parser.parseTandya,
    youtublog: parser.parseYoutublog
};
const articleParseFrontFunctions = {
    penobrol: parser.parseFrontPenobrol,
    tandya: parser.parseFrontTandya,
    youtublog: parser.parseFrontYoutublog
};

const replyParseFunctions = {
    penobrol: parser.parseComment,
    tandya: parser.parseAnswer,
    youtublog: parser.parseComment
};
const hashtagParseFunctions = {
    penobrol: parser.parseHashtagP,
    tandya: parser.parseHashtagT,
    youtublog: parser.parseHashtagY
};
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
const getReplyCountFunctions = {
    penobrol: pcDao.penobrolComCountById,
    tandya: taDao.tandyaAnsCountById,
    youtublog: ycDao.youtublogComCountById
};
const getReplyFunctions = {
    penobrol: pcDao.penobrolComByScore,
    tandya: taDao.tandyaAnsByScore,
    youtublog: ycDao.youtublogComByScore
};
const getHashtagFunctions = {
    penobrol: phashDao.penobrolHashtagById,
    tandya: thashDao.tandyaHashtagById,
    youtublog: yhashDao.youtublogHashtagById
};
const getRereplyFunctions = {
    penobrol: pccDao.penobrolComComByPcId,
    tandya: tacDao.tandyaAnsComByTaId,
    youtublog: yccDao.youtublogComComByYcId
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
const rereplyParseFunctions = {
    penobrol: parser.parseCComment,
    tandya: parser.parseAComment,
    youtublog: parser.parseCComment
};

exports.getFullArticleById = async function(id, userId, type){
    const articleType = type;

    const articleResult = (await getFullArticleFunctions[articleType](id))[0];

    if (articleResult == null) return null;

    const article = articleParseFunctions[articleType](articleResult);
    const [likeStatus, replyCount, likesCount, hashtagsResult] = await Promise.all([
        likeStatusFunctions[articleType](id, userId),
        getReplyCountFunctions[articleType](id),
        likeCountFunctions[articleType](id),
        getHashtagFunctions[articleType](id)
    ]);

    article.likeStatus = !!(likeStatus[0].count);
    article.replyCount = replyCount[0].replyCount;
    article.likeCount = likesCount[0].articleLikeCount;
    article.hashtags = hashtagsResult.map(hashtagParseFunctions[articleType]);

    return article;
};

exports.getFullReplyByArticleId = async function(id, userId, type){
    const articleType = type;
    const replyResult = (await getReplyFunctions[articleType](id));

    let reply = replyResult.map(e => replyParseFunctions[articleType](e));
    reply = await applyAsyncToAll(type, reply, userId, getFullReply);

    return reply;
};

async function getFullReply(type, userId, reply) {
    const replyType = type;
    const [re_replyResult, likeStatus, likeCount] = await Promise.all([
        getRereplyFunctions[replyType](reply.id),
        replyLikeStatusFunctions[replyType](reply.id, userId),
        replyLikeCountFunctions[replyType](reply.id)
    ]);

    reply.comments = re_replyResult.map(rereplyParseFunctions[replyType]);
    reply.likeStatus = !!(likeStatus[0].count);
    reply.likeCount = likeCount[0].replyLikeCount;
    return reply;
}

function applyAsyncToAll(type, list, userId, asyncFun) {
    const promiseList = list.map(item => asyncFun(type, userId, item));
    return Promise.all(promiseList);
}
