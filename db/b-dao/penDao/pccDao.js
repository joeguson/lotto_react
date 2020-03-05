const mysql = require('mysql');
const b = require('../../../b.js');
const pool = mysql.createPool(b.poolConfig);
const dbcon = require('../../dbconnection');

//query가 없을때에는?
function doQuery(query, args) {
    return dbcon.doQuery(pool, query, args);
}

/* ===== select ===== */
exports.penobrolComComByPcId = (id) => doQuery(
    `SELECT p.*, u.u_id
    FROM pc_com as p
    join users as u
    on p.author = u.id
    WHERE p.pc_id = ?`,
    id
);
exports.penobrolComComById = (id) => doQuery(
    `SELECT p.*, u.u_id
    FROM pc_com as p
    join users as u
    on p.author = u.id
    where p.id = ?`,
    id
);

/* ===== insert ===== */
exports.insertPenobrolComCom = (author, content, pc_id) => doQuery(
    `INSERT INTO pc_com (author, content, pc_id)
    VALUES (?, ?, ?)`,
    [author, content, pc_id]
);

/* ===== delete ===== */
exports.deletePenobrolComCom = (id) => doQuery(
    `Delete from pc_com
    where id = ?`,
    id
);