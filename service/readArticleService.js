//article
const penobrolDao = require('../db/b-dao/penDao/penobrolDao');
const tandyaDao = require('../db/b-dao/tanDao/tandyaDao');
const youtublogDao = require('../db/b-dao/youDao/youtublogDao');
//readReplyFunctions
const readReplyFunction = require('./readReplyService');
//readLikeFunctions
const readLikeFunction = require('./readLikeService');
//readHashFunctions
const readHashFunction = require('./readHashService');
//others
const articleParser = require('../db/parser/articleParser.js');

const getFullArticleFunctions = {
    penobrol: penobrolDao.penobrolById,
    tandya: tandyaDao.tandyaById,
    youtublog: youtublogDao.youtublogById
};
const articleParseFunctions = {
    penobrol: articleParser.parsePenobrol,
    tandya: articleParser.parseTandya,
    youtublog: articleParser.parseYoutublog
};

exports.getFullArticleById = async function(id, userId, type){
    const articleResult = (await getFullArticleFunctions[type](id))[0];

    if (articleResult == null) return null;
    const article = articleParseFunctions[type](articleResult);

    const [likeStatus, replyCount, likeCount, hashtagResult] = await Promise.all([
        readLikeFunction.articleLikeStatus(id, userId, type),
        readReplyFunction.countReplyByArticleId(id, type),
        readLikeFunction.articleLikeCount(id, type),
        readHashFunction.getHash(id, type)
    ]);

    article.likeStatus = likeStatus;
    article.replyCount = replyCount;
    article.likeCount = likeCount;
    article.hashtags = hashtagResult;

    return article;
};

// const getFrontArticleFunctions = {
//     penobrol: penobrolDao.penobrolById,
//     tandya: tandyaDao.tandyaById,
//     youtublog: youtublogDao.youtublogById
// };
// const articleParseFrontFunctions = {
//     penobrol: articleParser.parseFrontPenobrol,
//     tandya: articleParser.parseFrontTandya,
//     youtublog: articleParser.parseFrontYoutublog
// };
//
// exports.getFrontArticle = async function(type){
//     const results = await Promise.all([
//         penobrolDao.penobrolByDate(),
//         penobrolDao.penobrolByScore()
//     ]);
//     // byDate, byScore 를 penobrol 객체로 변환
//     const parsed = results.map(subject =>
//         subject.map(parser.parseFrontPenobrol)
//     );
//     // byDate, byScore 에 있는 penobrol 들에게 hashtag 와 comment 개수를 넣어줌
//     return await Promise.all(parsed.map((list) => applyAsyncToAll(list, getFullPenobrol)));
// };

const updateArticleScoreFunctions = {
    penobrol: penobrolDao.updatePenobrolScore,
    tandya: tandyaDao.updateTandyaScore,
    youtublog: youtublogDao.updateYoutublogScore
};

exports.updateArticleScore = async function(articleId, type){
    await updateArticleScoreFunctions[type](articleId);
};