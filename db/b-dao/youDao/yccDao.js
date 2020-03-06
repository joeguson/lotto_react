const mysql = require('mysql');
const b = require('../../../b.js');
const pool = mysql.createPool(b.poolConfig);
const dbcon = require('../../dbconnection');

//query가 없을때에는?
function doQuery(query, args) {
    return dbcon.doQuery(pool, query, args);
}

/* ===== select ===== */
exports.youtublogComComByYcId = (id) => doQuery(
    `SELECT y.*, u.u_id
    FROM yc_com as y
    join users as u
    on y.author = u.id
    WHERE y.yc_id = ?`,
    id
);
exports.youtublogComComById = (id) => doQuery(
    `select y.*, u.u_id
    from yc_com as y
    join users as u
    on y.author = u.id
    where y.id = ?`,
    id
);

/* ===== insert ===== */
exports.insertYoutublogComCom = (author, content, yc_id) => doQuery(
    `INSERT INTO yc_com (author, content, yc_id)
    VALUES (?, ?, ?)`,
    [author, content, yc_id]
);

/* ===== delete ===== */
exports.deleteYoutublogComCom = (id) => doQuery(
    `Delete from yc_com
    where id = ?`,
    id
);