const mysql = require('mysql');
const b = require('../../../b.js');
const pool = mysql.createPool(b.poolConfig);
const dbcon = require('../../dbconnection');

//query가 없을때에는?
function doQuery(query, args) {
    return dbcon.doQuery(pool, query, args);
}

/* ===== select ===== */
exports.tandyaAnsComByTaId = (id) => doQuery(
        `SELECT t.*, u.u_id
    FROM ta_com as t
    join users as u
    on t.author = u.id
    WHERE t.ta_id = ?`,
    id
);
exports.tandyaAnsComById = (id) => doQuery(
        `select t.*, u.u_id
    from ta_com as t
    join users as u
    on t.author = u.id
    where t.id = ?`,
    id
);

/* ===== insert ===== */
exports.insertTandyaAnsCom = (author, content, ta_id) => doQuery(
        `INSERT INTO ta_com (author, content, ta_id)
    VALUES (?, ?, ?)`,
    [author, content, ta_id]
);

/* ===== delete ===== */
exports.deleteTandyaAnsCom = (id) => doQuery(
        `Delete from ta_com
    where id = ?`,
    id
);