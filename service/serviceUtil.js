// lotto
const lottoDao = require('../db/b-dao/lotto');

// exports.postCombination = async function(arr){
//     const result = await lottoDao.insertCombination(arr);
//     return result.protocol41;
// };

exports.postHistory = async function(comb){
    const result = await lottoDao.insertHistory(comb[1], comb[2], comb[3], comb[4], comb[5], comb[6], comb[7]);
    return result.protocol41;
};

exports.getHistoryById = async function(id){
    return await lottoDao.selectHistoryById(id);
};

exports.getCombById = async function(combId){
    return await lottoDao.selectCombById(combId);
};