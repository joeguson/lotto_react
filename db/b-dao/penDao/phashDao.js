const mysql = require('mysql');
const b = require('../../../b.js');
const pool = mysql.createPool(b.poolConfig);
const dbcon = require('../../dbconnection');

//query가 없을때에는?
function doQuery(query, args) {
    return dbcon.doQuery(pool, query, args);
}

/* ===== select ===== */
exports.penobrolHashtagById = (id) => doQuery(
    `select *
    from penobrol_hashtag
    where p_id = ?`,
    id
);
exports.penobrolSearchByHash = (hash) => doQuery(
    `select *
    from penobrol
    where id in
    (select distinct p_id from penobrol_hashtag where hash like ?)`,
    hash
);

/* ===== insert ===== */
exports.insertPenobrolHash = (id, hash) => doQuery(
    `INSERT INTO penobrol_hashtag (p_id, hash)
    VALUES (?, ?)`,
    [id, hash]
);

/* ===== delete ===== */
exports.deletePenobrolHash = (id) => doQuery(
    `Delete from penobrol_hashtag
    where p_id = ?`,
    id
);
