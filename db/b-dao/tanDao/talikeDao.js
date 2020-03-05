const mysql = require('mysql');
const b = require('../../b.js');
const pool = mysql.createPool(b.poolConfig);
const dbcon = require('../dbconnection');

//query가 없을때에는?
function doQuery(query, args) {
    return dbcon.doQuery(pool, query, args);
}

/* ===== select ===== */
exports.tandyaAnsLikeById = (id) => doQuery(
    `SELECT *
    from ta_like
    where ta_id = ?`,
    id
);
exports.tandyaAnsLikeCount = (id) => doQuery(
    `select count(ta_id)
    as taLikeCount
    from ta_like
    where ta_id = ?`,
    id
);
exports.tandyaAnsLikeCountByAuthor = (id) => doQuery(
    `select count(c.ta_id)
    as total from(
        select t.id, t.author, tl.ta_id
        from t_ans
        as t
        inner join ta_like
        as tl
        on t.id = tl.ta_id
        where t.author = ?
    ) as c`,
    id
);

/* ===== update ===== */

/* ===== insert ===== */
exports.insertTandyaAnsLike = (ta_id, u_id) => doQuery(
    `INSERT INTO ta_like (ta_id, u_id)
    VALUES (?, ?)`,
    [ta_id, u_id]
);

/* ===== delete ===== */
exports.deleteTandyaAnsLike = (id, u_id) => doQuery(
    `DELETE FROM ta_like
    WHERE ta_id = ?
    AND u_id = ?`,
    [id, u_id]
);