const samusilDao = require('../db/b-dao/samusilDao');

/* ===== exports ===== */

// exports.getOrderedPenobrol = async function() {
//     // date, score 기준으로 penobrol 를 받아오는 것을 병렬로 처리
//     const results = await Promise.all([
//         penobrolDao.penobrolByDate(),
//         penobrolDao.penobrolByScore()
//     ]);
//     return results;
// };

exports.getSamusilInfo = async function() {
    const results = await Promise.all([
        //samusilDao 사용
        samusilDao.countUsers(),
        samusilDao.countPenobrol(),
        samusilDao.countTandya(),
        samusilDao.countYoutublog(),
        samusilDao.countComments(),
        samusilDao.countAnswers()
    ]);
    return results;
};