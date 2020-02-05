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

exports.postAnswer = async function(t_id, author, answer) {
    const ans = await tandyaDao.insertTandyaAns(author, answer, t_id);
    await tandyaDao.updateTandyaScore(t_id);
    return ans.insertId;
};

exports.postAnswerCom = async function(ta_id, author, content) {
    // 결과에 상관 없는 처리이므로 굳이 기다리지 않아도 됨
    tandyaDao.updateTandyaAnsScore(ta_id);

    const postCom = await tandyaDao.insertTandyaAnsCom(author, content, ta_id);
    // 삽입 시간을 db 기준으로 하지 않고 서버 시간을 기준으로 하면 모든 정보를 알고 있기 때문에 추가 쿼리를 할 필요 없음
    // 즉, 아래의 await tandyaAnsComById(postCom.insertId) 은 db 시간을 기준으로 하기 때문에 생기는
    // 완전히 불필요한 문장
    return (await tandyaDao.tandyaAnsComById(postCom.insertId))[0];
};

exports.likeTandya = async function(t_id, user, val) {
    if(val) await tandyaDao.deleteTandyaLike(t_id, user);
    else await tandyaDao.insertTandyaLike(t_id, user);
    await tandyaDao.updateTandyaScore(t_id);
    return Number(!val);
};

exports.tandyaLikeCount = async function(t_id) {
    return (await tandyaDao.tandyaLikeCount(t_id))[0].tlikeCount;
};

exports.likeTandyaAnswer = async function(ta_id, user, val) {
    if(val) await tandyaDao.deleteTandyaAnsLike(ta_id, user);
    else await tandyaDao.insertTandyaAnsLike(ta_id, user);
    await tandyaDao.updateTandyaAnsScore(ta_id);
    return Number(!val);
};

exports.tandyaAnsLikeCount = async function(ta_id) {
    return (await tandyaDao.tandyaAnsLikeCount(ta_id))[0].taLikeCount;
};

const fs = {
    t: [tandyaDao.tandyaWarnById, tandyaDao.insertTandyaWarn],
    ta: [tandyaDao.tandyaAnsWarnById, tandyaDao.insertTandyaAnsWarn],
    tac: [tandyaDao.tandyaAnsComWarnById, tandyaDao.insertTandyaAnsComWarn]
};
exports.warnTandya = async function(warnedItem, warnedId, user) {
    const checking = await fs[warnedItem][0](warnedId, user);
    if(checking.length) return 0;
    await fs[warnedItem][1](warnedId, user);
    return 1;
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