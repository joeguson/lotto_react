//replyServices
const replyService = require('./replyService');
//rereplyServices
const rereplyService = require('./rereplyService');
//likeServices
const likeService = require('./likeService');
//hashServices
const hashService = require('./hashService');
//others
const articleParser = require('../db/parser/articleParser.js');

/* ===== utils for parse ===== */
const articleParseFrontFunctions = {
    penobrol: articleParser.parseFrontPenobrol,
    tandya: articleParser.parseFrontTandya,
    youtublog: articleParser.parseFrontYoutublog
};

/* ===== utils for all ===== */
exports.applyAsyncToAll = function(type, list, userId, asyncFun) {
    const promiseList = list.map(item => asyncFun(type, userId, item));
    return Promise.all(promiseList);
};

/* ===== utils for article ===== */
exports.__articleFrontParseSupplement = async function(articles, type){
    let parsed = articles.map(articleParseFrontFunctions[type]);
    parsed.forEach((item) => {
        if(item.chosen !== 0) getChosenContent(item, type);
        else item.chosenContent = null;
    });
    return await Promise.all(parsed.map(item => __getCommonComponents(item, type)));
};

exports.getCommonComponents = async function(article, type) {
    return await __getCommonComponents(article, type);
};

async function __getCommonComponents(article, type){
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

async function getChosenContent(article, type) {
    article.chosenContent = await replyService.getReplyById(article.chosen, type);
    return article;
}

/* ===== utils for reply ===== */
exports.getReplyDetails = async function(type, userId, item) {
    const [re_replyResult, likeStatus, likeCount] = await Promise.all([
        rereplyService.getFullReReply(item.id, type),
        likeService.replyLikeStatus(item.id, userId, type),
        likeService.replyLikeCount(item.id, type),
    ]);
    item.comments = re_replyResult;
    item.likeStatus = likeStatus;
    item.likeCount = likeCount;

    return item;
};


/* ===== others ===== */
exports.dateMaker = function(date) {
    const tempDate = new Date(date);
    const nowDate = new Date();
    // const year = tempDate.getFullYear();
    const month = (tempDate.getMonth()) + 1;
    const day = tempDate.getDate();
    const diff = nowDate - tempDate;
    if(diff >=31536000000)
        return 'over a year ago';
    else if (diff > 864000000)
        return month + '-' + day;
    else if (diff > 86400000)
        return Math.round(diff/86400000) + ' days ago';
    else if (diff > 3600000)
        return Math.round(diff/3600000) + ' h ago';
    else if (diff > 60000)
        return Math.round(diff/60000) + ' min ago';
    else
        return Math.round(diff/1000) + ' sec ago';
};

exports.flatten = function(list) {
    const flatArrayReducer = (acc, val) => {
        return acc.concat(val);
    };
    // console.log(flattenedData);
    return list.reduce(flatArrayReducer, []);
};