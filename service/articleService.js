//article
const penobrolDao = require('../db/b-dao/penDao/penobrolDao');
const tandyaDao = require('../db/b-dao/tanDao/tandyaDao');
const youtublogDao = require('../db/b-dao/youDao/youtublogDao');
//replyServices
const replyService = require('./replyService');
//likeServices
const likeService = require('./likeService');
//hashServices
const hashService = require('./hashService');
//others
const articleParser = require('../db/parser/articleParser.js');
const serviceUtil = require('./serviceUtil');

const getCariFrontArticleFunctions = {
    penobrol: penobrolDao.cariPenobrol,
    tandya: tandyaDao.cariTandya,
    youtublog: youtublogDao.cariYoutublog
};

exports.getCariFrontArticle = async function(type){
    const temp = await getCariFrontArticleFunctions[type]();
    let parsed = temp.map(articleParseFrontFunctions[type]);

    parsed.map((item) => {
        if(item.chosen != 0) getChosenContent(item, type);
        else item.chosenContent = null;
    });
    return [await Promise.all(parsed.map(item => getCommonComponents(item, type)))];
};

const getFrontArticleFunctions = {
    penobrol: [penobrolDao.penobrolByScore, penobrolDao.penobrolByDate],
    tandya: [tandyaDao.tandyaByScore, tandyaDao.tandyaByDate],
    youtublog: [youtublogDao.youtublogByScore, youtublogDao.youtublogByDate]
};

const articleParseFrontFunctions = {
    penobrol: articleParser.parseFrontPenobrol,
    tandya: articleParser.parseFrontTandya,
    youtublog: articleParser.parseFrontYoutublog
};

exports.getFrontArticle = async function(type){
    //2개의 쿼리를 실행하므로 flatten 함수 필요
    let results = serviceUtil.flatten(await Promise.all([
        getFrontArticleFunctions[type][0](),
        getFrontArticleFunctions[type][1]()
    ]));
    // byDate, byScore 를 penobrol 객체로 변환
    let parsed = results.map(articleParseFrontFunctions[type]);
    parsed.map((item) => {
        if(item.chosen != 0) getChosenContent(item, type);
        else item.chosenContent = null;
    });
    return [await Promise.all(parsed.map(item => getCommonComponents(item, type)))];
};

const getFrontArticleByIdFunctions = {
    penobrol: penobrolDao.penobrolById,
    tandya: tandyaDao.tandyaById,
    youtublog: youtublogDao.youtublogById
};
exports.getFrontArticleById = async function(articleId, type){
    let results = await getFrontArticleByIdFunctions[type](articleId);

    // byDate, byScore 를 penobrol 객체로 변환
    let parsed = results.map(articleParseFrontFunctions[type]);
    parsed.map((item) => {
        if(item.chosen != 0) getChosenContent(item, type);
        else item.chosenContent = null;
    });
    return await Promise.all(parsed.map(item => getCommonComponents(item, type)));
};

const getRandArticleFunctions = {
    penobrol: penobrolDao.penobrolByRand,
    tandya: tandyaDao.tandyaByRand,
    youtublog: youtublogDao.youtublogByRand
};

exports.getRandFrontArticle = async function (type) {
    let results = await getRandArticleFunctions[type]();
    let parsed = results.map(articleParseFrontFunctions[type]);
    parsed.map((item) => {
        if(item.chosen != 0) getChosenContent(item, type);
        else item.chosenContent = null;
    });
    return [await Promise.all(parsed.map(item => getCommonComponents(item, type)))];
};

const getArticleByAuthorFunctions = {
    penobrol: penobrolDao.penobrolByAuthor,
    tandya: tandyaDao.tandyaByAuthor,
    youtublog: youtublogDao.youtublogByAuthor
};

exports.getArticleByAuthor = async function (id2, type) {
    let results = await getArticleByAuthorFunctions[type](id2);
    let parsed = results.map(articleParseFrontFunctions[type]);
    parsed.map((item) => {
        if(item.chosen != 0) getChosenContent(item, type);
        else item.chosenContent = null;
    });
    return [await Promise.all(parsed.map(item => getCommonComponents(item, type)))];
};

const getArticleByAuthorWithoutAnonimFunctions = {
    penobrol: penobrolDao.penobrolByAuthorWithoutAnonim,
    tandya: tandyaDao.tandyaByAuthorWithoutAnonim,
    youtublog: youtublogDao.youtublogByAuthorWithoutAnonim
};

exports.getArticleByAuthorWithoutAnonim = async function (id2, type) {
    let results = await getArticleByAuthorWithoutAnonimFunctions[type](id2);
    let parsed = results.map(articleParseFrontFunctions[type]);
    parsed.map((item) => {
        if(item.chosen != 0) getChosenContent(item, type);
        else item.chosenContent = null;
    });
    return [await Promise.all(parsed.map(item => getCommonComponents(item, type)))];
};

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

    article.likeStatus = await likeService.articleLikeStatus(id, userId, type);

    return await getCommonComponents(article, type);
};

const updateArticleScoreFunctions = {
    penobrol: penobrolDao.updatePenobrolScore,
    tandya: tandyaDao.updateTandyaScore,
    youtublog: youtublogDao.updateYoutublogScore
};

exports.updateArticleScore = async function(articleId, type){
    await updateArticleScoreFunctions[type](articleId);
};

const updateArticleChosenFunctions = {
    penobrol: penobrolDao.updateChosenPcom,
    tandya: tandyaDao.updateChosenTans,
    youtublog: youtublogDao.updateChosenYcom
};
exports.updateArticleChosen = function(articleId, replyId, type){
    return updateArticleChosenFunctions[type](articleId, replyId);
};

const searchArticleFunctions = {
    penobrol: penobrolDao.penobrolSearch,
    tandya: tandyaDao.tandyaSearch,
    youtublog: youtublogDao.youtublogSearch
};

exports.searchArticle = async function (string, type) {
    const results = await searchArticleFunctions[type](string);

    let parsed = results.map(articleParseFrontFunctions[type]);
    parsed.map((item) => {
        if(item.chosen != 0) getChosenContent(item, type);
        else item.chosenContent = null;
    });
    return [await Promise.all(parsed.map(item => getCommonComponents(item, type)))];
};

const postArticleFunctions = {
    penobrol: penobrolDao.insertPenobrol,
    tandya: tandyaDao.insertTandya,
    youtublog: youtublogDao.insertYoutublog
};

exports.postArticle = async function(author, title, content, publicCode, thumbnail, hashtags, type){
    const article = await postArticleFunctions[type](author, title, content, publicCode, thumbnail);
    if (hashtags != null && hashtags.length > 0)
        await hashService.postHashtags(article.insertId, hashtags, type);

    return article.insertId;
};

const updateArticleViewFunctions = {
    penobrol: penobrolDao.updatePenobrolView,
    tandya: tandyaDao.updateTandyaView,
    youtublog: youtublogDao.updateYoutublogView
};

exports.updateViewArticle = async function(articleId, type){
    await updateArticleViewFunctions[type](articleId);
    await updateArticleScoreFunctions[type](articleId);
};

const editArticleFunctions = {
    penobrol: penobrolDao.updatePenobrol,
    tandya: tandyaDao.updateTandya,
    youtublog: youtublogDao.updateYoutublog
};
const updateArticleDateFunctions = {
    penobrol: penobrolDao.updatePenobrolDate,
    tandya: tandyaDao.updateTandyaDate,
    youtublog: youtublogDao.updateYoutublogDate
};
exports.editArticle = async function(articleId, title, content, publicCode, thumbnail, hashtags, type){
    updateArticleDateFunctions[type](articleId);
    editArticleFunctions[type](title, content, publicCode, thumbnail, articleId);
    await hashService.deleteHashtags(articleId, type);
    if (hashtags != null && hashtags.length > 0)
        await hashService.postHashtags(articleId, hashtags, type);

    return articleId;
};

async function getChosenContent(article, type) {
    article.chosenContent = await replyService.getReplyById(article.chosen, type);
    return article;
}

async function getCommonComponents(article, type) {
    // hashtag 를 가져오는 작업과 comment 개수를 가져오는 작업을 병렬로 처리
    const [replyCount, likeCount, hashtagResult] = await Promise.all([
        replyService.countReplyByArticleId(article.id, type),
        likeService.articleLikeCount(article.id, type),
        hashService.getHash(article.id, type)
    ]);
    article.replyCount = replyCount;
    article.likeCount = likeCount;
    article.hashtags = hashtagResult;
    return article;
}

function applyAsyncToAll(item, asyncFun, type) {
    const promiseList = asyncFun(item, type);
    return Promise.all(promiseList);
}