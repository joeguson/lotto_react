//re_reply
const pccDao = require('../db/b-dao/penDao/pccDao');
const tacDao = require('../db/b-dao/tanDao/tacDao');
const yccDao = require('../db/b-dao/youDao/yccDao');
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

