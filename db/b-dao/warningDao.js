const daoUtil = require('../daoUtil');

////////////////Insert////////////////

function __insertWarningFunction(table_name) {
    return (u_id, warned_id) => daoUtil.doQuery(
        `INSERT INTO ${table_name} (u_id, warned_id) VALUES(?, ?)`,
        [u_id, warned_id]
    );
}

exports.insertPenobrolWarning = __insertWarningFunction("p_warning");
exports.insertPenobrolComWarning = __insertWarningFunction("pc_warning");
exports.insertPenobrolComComWarning = __insertWarningFunction("pcc_warning");
exports.insertTandyaWarning = __insertWarningFunction("t_warning");
exports.insertTandyaAnsWarning = __insertWarningFunction("ta_warning");
exports.insertTandyaAnsComWarning = __insertWarningFunction("tac_warning");
exports.insertYoutublogWarning = __insertWarningFunction("y_warning");
exports.insertYoutublogComWarning = __insertWarningFunction("yc_warning");
exports.insertYoutublogComComWarning = __insertWarningFunction("ycc_warning");

////////////////Select////////////////

function __selectWarningFunc(table_name) {
    return (u_id, warned_id) =>
        new Promise(resolve => daoUtil.doQuery(
            `SELECT COUNT(u_id) AS count FROM ${table_name} WHERE u_id = ? AND warned_id = ?`,
            [u_id, warned_id]
            ).then(e => resolve(e[0].count))
        );
}

exports.countPenobrolWarning = __selectWarningFunc("p_warning");
exports.countPenobrolComWarning = __selectWarningFunc("pc_warning");
exports.countPenobrolComComWarning = __selectWarningFunc("pcc_warning");
exports.countTandyaWarning = __selectWarningFunc("t_warning");
exports.countTandyaAnsWarning = __selectWarningFunc("ta_warning");
exports.countTandyaAnsComWarning = __selectWarningFunc("tac_warning");
exports.countYoutublogWarning = __selectWarningFunc("y_warning");
exports.countYoutublogComWarning = __selectWarningFunc("yc_warning");
exports.countYoutublogComComWarning = __selectWarningFunc("ycc_warning");