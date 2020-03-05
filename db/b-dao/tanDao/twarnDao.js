const mysql = require('mysql');
const b = require('../../b.js');
const pool = mysql.createPool(b.poolConfig);
const dbcon = require('../dbconnection');

//query가 없을때에는?
function doQuery(query, args) {
    return dbcon.doQuery(pool, query, args);
}

/* ===== select ===== */
exports.tandyaWarnById = (u_id, id) => doQuery(
    `select u_id, t_id
    from t_warning
    where u_id = ?
    AND t_id = ?`,
    [u_id, id]
);
exports.tandyaAnsWarnById = (u_id, id) => doQuery(
    `select u_id, ta_id
    from ta_warning
    where u_id = ?
    AND ta_id = ?`,
    [u_id, id]
);
exports.tandyaAnsComWarnById = (u_id, id) => doQuery(
    `select u_id, tac_id
    from tac_warning
    where u_id = ?
    AND tac_id = ?`,
    [u_id, id]
);

/* ===== update ===== */

/* ===== insert ===== */
exports.insertTandyaWarn = (t_id, u_id) => doQuery(
    `insert into t_warning(t_id, u_id)
    values(?, ?)`,
    [t_id, u_id]
);
exports.insertTandyaAnsWarn = (ta_id, u_id) => doQuery(
    `insert into ta_warning(ta_id, u_id)
    values(?, ?)`,
    [ta_id, u_id]
);
exports.insertTandyaAnsComWarn = (tac_id, u_id) => doQuery(
    `insert into tac_warning(tac_id, u_id)
    values(?, ?)`,
    [tac_id, u_id]
);
/* ===== delete ===== */
