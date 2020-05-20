//re_reply
const pccDao = require('../db/b-dao/penDao/pccDao');
const tacDao = require('../db/b-dao/tanDao/tacDao');
const yccDao = require('../db/b-dao/youDao/yccDao');
//replyServices
const replyService = require('./replyService');
//others
const reReplyParser = require('../db/parser/reReplyParser.js');

const getRereplyFunctions = {
    penobrol: pccDao.penobrolComComByPcId,
    tandya: tacDao.tandyaAnsComByTaId,
    youtublog: yccDao.youtublogComComByYcId
};
const reReplyParseFunctions = {
    penobrol: reReplyParser.parsePenobrolCComment,
    tandya: reReplyParser.parseTandyaAComment,
    youtublog: reReplyParser.parseYoutublogCComment
};

exports.getFullReReply = async function(id, type){
    return (await getRereplyFunctions[type](id)).map(reReplyParseFunctions[type]);
};

const postReReplyFunctions = {
    penobrol: pccDao.insertPenobrolComCom,
    tandya: tacDao.insertTandyaAnsCom,
    youtublog: yccDao.insertYoutublogComCom
};
const getReReplyById = {
    penobrol: pccDao.penobrolComComById,
    tandya: tacDao.tandyaAnsComById,
    youtublog: yccDao.youtublogComComById
};

exports.postReReply = async function (reply_id, userId, type, content) {
    const reReplyResult = await postReReplyFunctions[type](userId, content, reply_id);
    await replyService.updateReplyScore(reply_id, type);
    let reReply = (await getReReplyById[type](reReplyResult.insertId)).map(reReplyParseFunctions[type]);
    return reReply[0];
};