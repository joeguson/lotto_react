const parser = require('../db/parser/articleParser.js');
const tandyaDao = require('../db/b-dao/tanDao/tandyaDao');
const tacDao = require('../db/b-dao/tanDao/tacDao');
const taDao = require('../db/b-dao/tanDao/taDao');
const talikeDao = require('../db/b-dao/tanDao/talikeDao');
const thashDao = require('../db/b-dao/tanDao/thashDao');
const tlikeDao = require('../db/b-dao/tanDao/tlikeDao');

/* ===== exports ===== */

exports.searchTandyaByHash = async function(array) {
    let thResults = [];
    for(var h of array){
        thResults = ((await thashDao.tandyaSearchByHash('%'+h+'%')).reduce((acc, cur) => acc.concat(cur), [])).map(parser.parseFrontTandya);
    }
    return await applyAsyncToAll(thResults, getFullTandya);
};

exports.getUserTandyaWithoutAnonim = async function(id2) {
    const results = await tandyaDao.tandyaByAuthorWithoutAnonim(id2);
    const parsed = results.map(subject =>
        parser.parseFrontTandya(subject)
    );
    return await applyAsyncToAll(parsed, getFullTandya);
};

// tandya 의 조회수를 올리고 그에 따라 점수를 업데이트 하는 함수
exports.updateTandyaView = async function(id) {
    // 조회수가 업데이트된 후 점수가 업데이트 돼야 하므로 직렬 처리
    await tandyaDao.updateTandyaView(id);
    await tandyaDao.updateTandyaScore(id);
};

// tandya 와 hashtag 를 post 하고 id를 반환하는 함수
exports.postTandya = async function(author, question, content, publicCode, thumbnail, hashtags) {
    const tandya = await tandyaDao.insertTandya(author, question, content, publicCode, thumbnail);
    if(hashtags != null && hashtags.length > 0)
        insertHashtags(tandya.insertId, hashtags);
    return tandya.insertId;
};

exports.editTandya = async function(t_id, question, content, publicCode, thumbnail, hashtags) {
    tandyaDao.updateTandyaDate(t_id);
    tandyaDao.updateTandya(question, content, publicCode, thumbnail, t_id);
    await thashDao.deleteTandyaHash(t_id);
    if(hashtags != null && hashtags.length > 0)
        await insertHashtags(t_id, hashtags);
    return t_id;
};

exports.editAnswer = async function(ta_id, content, t_id) {
    await taDao.updateTandyaAns(content, ta_id, t_id);
    return ta_id;
};

exports.deleteTandya = async function(t_id, u_id) {
    return await deleteProcess(t_id, u_id, tandyaDao.tandyaById, tandyaDao.deleteTandya);
};

exports.deleteAnswer = async function(ta_id, u_id) {
    return await deleteProcess(ta_id, u_id, taDao.tandyaAnsById, taDao.deleteTandyaAns);
};

exports.deleteAComment = async function(tac_id, u_id) {
    return await deleteProcess(tac_id, u_id, tacDao.tandyaAnsComById, tacDao.deleteTandyaAnsCom);
};

/* ===== local functions ===== */

// 하나의 tandya 에 hashtag 와 answer 개수를 넣어주는 함수
async function getFullTandya(tandya) {
    // hashtag 를 가져오는 작업과 answer 개수를 가져오는 작업을 병렬로 처리
    const [hashtagResult, ansCountResult, tandyaLikeCount] = await Promise.all([
        thashDao.tandyaHashtagById(tandya.id),
        taDao.tandyaAnsCountById(tandya.id),
        tlikeDao.tandyaLikeCount(tandya.id)
    ]);

    tandya.hashtags = hashtagResult.map(parser.parseHashtagT);
    tandya.replyCount = ansCountResult[0].replyCount;
    tandya.likeCount = tandyaLikeCount[0].likeCount;
    return tandya;
}

async function getFullAnswer(answer) {
    const [commentsResult, likesResult] = await Promise.all([
        tacDao.tandyaAnsComByTaId(answer.id),
        talikeDao.tandyaAnsLikeById(answer.id)
    ]);

    answer.comments = commentsResult.map(parser.parseAComment);
    answer.likes = likesResult.map(parser.parseALike);
    return answer;
}

function insertHashtags(t_id, hashtags) {
    const insertHashtag = (hashtag) => thashDao.insertTandyaHash(t_id, hashtag);
    return applyAsyncToAll(hashtags, insertHashtag);
}

async function deleteProcess(id, u_id, selector, deleter) {
    const t = (await selector(id))[0];
    if(t == null || u_id !== t.author) return false;
    await deleter(id);
    return true;
}

function applyAsyncToAll(list, asyncFun) {
    const promiseList = list.map(item => asyncFun(item));
    return Promise.all(promiseList);
}