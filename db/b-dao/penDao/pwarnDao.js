const mysql = require('mysql');
const b = require('../../../b');
const pool = mysql.createPool(b.poolConfig);
const dbcon = require('../../dbconnection');

//query가 없을때에는?
function doQuery(query, args) {
    return dbcon.doQuery(pool, query, args);
}

/* ===== select ===== */
exports.penobrolWarnById = (id, userId) => doQuery(
    `select u_id, p_id
    from p_warning
    where u_id = ?
    AND p_id = ?`,
    [userId, id]
);
exports.penobrolComWarnById = (id, userId) => doQuery(
    `select u_id, pc_id
    from pc_warning
    where u_id = ?
    AND pc_id = ?`,
    [userId, id]
);
exports.penobrolComComWarnById = (id, userId) => doQuery(
    `select u_id, pcc_id
    from pcc_warning
    where u_id = ?
    AND pcc_id = ?`,
    [userId, id]
);

/* ===== insert ===== */
exports.insertPenobrolWarn = (u_id, p_id) => doQuery(
    `insert into p_warning(u_id, p_id)
    values(?, ?)`,
    [u_id, p_id]
);
exports.insertPenobrolComWarn = (u_id, pc_id) => doQuery(
    `insert into pc_warning(u_id, pc_id)
    values(?, ?)`,
    [u_id, pc_id]
);

exports.insertPenobrolComComWarn = (u_id, pcc_id) => doQuery(
    `insert into pcc_warning(u_id, pcc_id)
    values(?, ?)`,
    [u_id, pcc_id]
);

