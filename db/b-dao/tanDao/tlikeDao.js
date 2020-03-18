const mysql = require('mysql');
const b = require('../../../b.js');
const pool = mysql.createPool(b.poolConfig);
const dbcon = require('../../dbconnection');

//query가 없을때에는?
function doQuery(query, args) {
    return dbcon.doQuery(pool, query, args);
}

/* ===== select ===== */
exports.tandyaLikeById = (id) => doQuery(
    `SELECT *
    from t_like
    where t_id = ?`,
    id
);
exports.tandyaLikeCount = (id) => doQuery(
    `select count(t_id)
    as tlikeCount
    from t_like
    where t_id = ?`,
    id
);

exports.tandyaLikeByAuthor = (tandyaId, userId) => doQuery(
    `SELECT COUNT(*) 
    AS count
    FROM t_like
    WHERE t_id = ? AND u_id = ?`,
    [tandyaId, userId]
);

exports.tandyaLikeCountByAuthor = (id) => doQuery(
    `select count(c.t_id)
    as total
    from(
        select t.id, t.author, tl.t_id
        from tandya
        as t
        inner join t_like
        as tl
        on t.id = tl.t_id
        where t.author = ?
    )
    as c`,
    id
);
/* ===== update ===== */

/* ===== insert ===== */
exports.insertTandyaLike = (t_id, u_id) => doQuery(
    `INSERT INTO t_like (t_id, u_id)
    VALUES (?, ?)`,
    [t_id, u_id]
);

/* ===== delete ===== */
exports.deleteTandyaLike = (id, u_id) => doQuery(
    `DELETE FROM t_like
    WHERE t_id = ?
    AND u_id = ?`,
    [id, u_id]
);