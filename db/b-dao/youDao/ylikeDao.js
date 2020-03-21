const mysql = require('mysql');
const b = require('../../../b.js');
const pool = mysql.createPool(b.poolConfig);
const dbcon = require('../../dbconnection');

//query가 없을때에는?
function doQuery(query, args) {
    return dbcon.doQuery(pool, query, args);
}

/* ===== select ===== */
exports.youtublogLikeById = (id) => doQuery(
    `SELECT *
    from y_like
    where y_id = ?`,
    id
);
exports.youtublogLikeCount = (id) => doQuery(
    `select count(y_id)
    as articleLikeCount
    from y_like
    where y_id = ?`,
    id
);

exports.youtublogLikeByAuthor = (youtublogId, userId) => doQuery(
    `SELECT COUNT(*) 
    AS count
    FROM y_like
    WHERE y_id = ? AND u_id = ?;`,
    [youtublogId, userId]
);

exports.youtublogLikeCountByAuthor = (id) => doQuery(
    `select count(c.y_id)
    as total
    from(
        select y.id, y.author, yl.y_id
        from youtublog
        as y
        inner join y_like
        as yl
        on y.id = yl.y_id
        where y.author = ?
    )
    as c`,
    id
);
/* ===== insert ===== */
exports.insertYoutublogLike = (y_id, u_id) => doQuery(
    `INSERT INTO y_like (y_id, u_id)
    VALUES (?, ?)`,
    [y_id, u_id]
);

/* ===== delete ===== */
exports.deleteYoutublogLike = (id, u_id) => doQuery(
    `DELETE FROM y_like
    WHERE y_id = ?
    AND u_id = ?`,
    [id, u_id]
);