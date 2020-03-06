const mysql = require('mysql');
const b = require('../../../b.js');
const pool = mysql.createPool(b.poolConfig);
const dbcon = require('../../dbconnection');

//query가 없을때에는?
function doQuery(query, args) {
    return dbcon.doQuery(pool, query, args);
}

/* ===== select ===== */
exports.youtublogHashtagById = (id) => doQuery(
    `SELECT *
    FROM youtublog_hashtag
    where y_id = ?`,
    id
);
exports.youtublogSearchByHash = (hash) => doQuery(
    `select *
    from youtublog
    where id in
    (select distinct t_id from youtublog_hashtag where hash like ?)`,
    hash
);
/* ===== insert ===== */
exports.insertYoutublogHash = (y_id, hash) => doQuery(
    `INSERT INTO youtublog_hashtag (y_id, hash)
    VALUES (?, ?)`,
    [y_id, hash]
);
/* ===== delete ===== */
exports.deleteYoutublogHash = (id) => doQuery(
    `Delete from youtublog_hashtag
    where y_id = ?`,
    id
);
