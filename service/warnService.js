//warn
const warningDao = require('../db/b-dao/warningDao');

//others
const componentParser = require('../db/parser/componentParser.js');

const warnArticleFunctions = {
    penobrol: warningDao.insertPenobrolWarning,
    tandya: warningDao.insertTandyaWarning,
    youtublog: warningDao.insertYoutublogWarning
};
const didWarnArticleFunctions = {
    penobrol: warningDao.countPenobrolWarning,
    tandya: warningDao.countTandyaWarning,
    youtublog: warningDao.countYoutublogWarning
};

exports.warnArticle = async function (u_id, warned_id, type) {
    return await warnArticleFunctions[type](u_id, warned_id);
};
exports.didWarnArticle = async function(u_id, warned_id, type) {
    return (await didWarnArticleFunctions[type](u_id, warned_id)) > 0;
};

const warnReplyFunctions = {
    penobrol: warningDao.insertPenobrolComWarning,
    tandya: warningDao.insertTandyaAnsWarning,
    youtublog: warningDao.insertYoutublogComWarning
};
const didWarnReplyFunctions = {
    penobrol: warningDao.countPenobrolComWarning,
    tandya: warningDao.countTandyaAnsWarning,
    youtublog: warningDao.countYoutublogComWarning
};

exports.warnReply = async function (u_id, warned_id, type) {
    return await warnReplyFunctions[type](u_id, warned_id);
};
exports.didWarnReply = async function(u_id, warned_id, type) {
    return (await didWarnReplyFunctions[type](u_id, warned_id)) > 0;
};

const warnReReplyFunctions = {
    penobrol: warningDao.insertPenobrolComComWarning,
    tandya: warningDao.insertTandyaAnsComWarning,
    youtublog: warningDao.insertYoutublogComComWarning
};
const didWarnReReplyFunctions = {
    penobrol: warningDao.countPenobrolComComWarning,
    tandya: warningDao.countTandyaAnsComWarning,
    youtublog: warningDao.countYoutublogComComWarning
};

exports.warnReReply = async function (u_id, warned_id, type) {
    return await warnReReplyFunctions[type](u_id, warned_id);
};
exports.didWarnReReply = async function(u_id, warned_id, type) {
    return (await didWarnReReplyFunctions[type](u_id, warned_id)) > 0;
};