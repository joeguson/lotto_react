const mysql = require('mysql');
const b = require('../../b.js');
const pool = mysql.createPool(b.poolConfig);
const dbcon = require('../dbconnection');

//query가 없을때에는?
function doQuery(query, args) {
    return dbcon.doQuery(pool, query, args);
}

/* ===== select ===== */
exports.tandyaHashtagById = (id) => doQuery(
    `SELECT *
    FROM tandya_hashtag
    where t_id = ?`,
    id
);
exports.tandyaSearchByHash = (hash) => doQuery(
    `select *
    from tandya
    where id in
    (select distinct t_id from tandya_hashtag where hash like ?)`,
    hash
);

/* ===== update ===== */

/* ===== insert ===== */
exports.insertTandyaHash = (t_id, hash) => doQuery(
    `INSERT INTO tandya_hashtag (t_id, hash)
    VALUES (?, ?)`,
    [t_id, hash]
);

/* ===== delete ===== */
exports.deleteTandyaHash = (id) => doQuery(
    `Delete from tandya_hashtag
    where t_id = ?`,
    id
);