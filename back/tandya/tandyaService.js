const parser = require('../../db/parser.js');
const tandyaDao = require('../../db/b-dao/tandyaDao');

/* ===== exports ===== */

exports.getOrderedTandya = async function() {
    // date, score 기준으로 tandya 를 받아오는 것을 병렬로 처리
    const results = await Promise.all([
        tandyaDao.tandyaByDate(),
        tandyaDao.tandyaByScore()
    ]);
    // byDate, byScore 를 tandya 객체로 변환
    const parsed = results.map(subject =>
        subject.map(parser.parseFrontTandya)
    );
    // byDate, byScore 에 있는 tandya 들에게 hashtag 와 answer 개수를 넣어줌
    return await Promise.all(parsed.map((list) => applyAsyncToAll(list, getFullTandya)));
};

// tandya id 로 tandya 관련된 모든 정보를 읽어오는 함수
exports.getFullTandyaById = async function(id) {
    const tandyaResult = await tandyaDao.tandyaById(id)[0];

    if(tandyaResult == null) return null;

    const tandya = parser.parseTandya(tandyaResult);

    const [answersResult, likesResult, hashtagsResult] = await Promise.all([
        tandyaDao.tandyaAnsByScore(id),
        tandyaDao.tandyaLikeById(id),
        tandyaDao.tandyaHashtagById(id)
    ]);

    tandya.answers = answersResult.map(parser.parseAnswer);
    tandya.likes = likesResult.map(parser.parseTLike);
    tandya.hashtags = hashtagsResult.map(parser.parseHashtagT);

    tandya.answers = await applyAsyncToAll(tandya.answers, getFullAnswer);
    return tandya;
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
    if(hashtags != null && hashtags.length > 0) {
        const insertHashtag = (hashtag) => tandyaDao.insertTandyaHash(tandya.insertId, hashtag);
        await applyAsyncToAll(hashtags, insertHashtag);
    }
    return tandya.insertId;
};

/* ===== local functions ===== */

// 하나의 tandya 에 hashtag 와 answer 개수를 넣어주는 함수
async function getFullTandya(tandya) {
    // hashtag 를 가져오는 작업과 answer 개수를 가져오는 작업을 병렬로 처리
    const [hashtagResult, ansCountResult] = await Promise.all([
        tandyaDao.tandyaHashtagById(tandya.id),
        tandyaDao.tandyaAnsCountById(tandya.id)
    ]);

    tandya.hashtags = hashtagResult.map(parser.parseHashtagT);
    tandya.answerCount = ansCountResult[0].count;
    return tandya;
}

async function getFullAnswer(answer) {
    const [commentsResult, likesResult] = await Promise.all([
        tandyaDao.tandyaAnsComByTaId(answer.id),
        tandyaDao.tandyaAnsLikeById(answer.id)
    ]);

    answer.comments = commentsResult.map(parser.parseAComment);
    answer.likes = commentsResult.map(parser.parseALike);
    return answer;
}

function applyAsyncToAll(list, asyncFun) {
    const promiseList = list.map(item => asyncFun(item));
    return Promise.all(promiseList);
}