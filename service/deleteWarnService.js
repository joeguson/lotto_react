//delete
const penobrolDao = require('../db/b-dao/penDao/penobrolDao');
const pcDao = require('../db/b-dao/penDao/pcDao');
const pccDao = require('../db/b-dao/penDao/pccDao');
const tandyaDao = require('../db/b-dao/tanDao/tandyaDao');
const tacDao = require('../db/b-dao/tanDao/tacDao');
const taDao = require('../db/b-dao/tanDao/taDao');
const youtublogDao = require('../db/b-dao/youDao/youtublogDao');
const yccDao = require('../db/b-dao/youDao/yccDao');
const ycDao = require('../db/b-dao/youDao/ycDao');

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

exports.deletePenobrol = async function (p_id, u_id) {
    return await deleteProcess(p_id, u_id, penobrolDao.penobrolById, penobrolDao.deletePenobrol);
};

exports.deletePComment = async function (pc_id, u_id) {
    return await deleteProcess(pc_id, u_id, pcDao.penobrolComById, pcDao.deletePenobrolCom);
};

exports.deletePCComment = async function (pcc_id, u_id) {
    return await deleteProcess(pcc_id, u_id, pccDao.penobrolComComById, pccDao.deletePenobrolComCom);
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

exports.deleteYoutublog = async function (y_id, u_id) {
    return await deleteProcess(y_id, u_id, youtublogDao.youtublogById, youtublogDao.deleteYoutublog);
};

exports.deleteYComment = async function (yc_id, u_id) {
    return await deleteProcess(yc_id, u_id, ycDao.youtublogComById, ycDao.deleteYoutublogCom);
};

exports.deleteYCComment = async function (ycc_id, u_id) {
    return await deleteProcess(ycc_id, u_id, yccDao.youtublogComComById, yccDao.deleteYoutublogComCom);
};

async function deleteProcess(id, u_id, selector, deleter) {
    const p = (await selector(id))[0];
    if (p == null || u_id !== p.author) return false;
    await deleter(id);
    return true;
}