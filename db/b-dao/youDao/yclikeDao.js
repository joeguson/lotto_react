const mysql = require('mysql');
const b = require('../../../b.js');
const pool = mysql.createPool(b.poolConfig);
const dbcon = require('../../dbconnection');

//query가 없을때에는?
function doQuery(query, args) {
    return dbcon.doQuery(pool, query, args);
}

/* ===== select ===== */
exports.youtublogComLikeById = (id) => doQuery(
    `SELECT *
    from yc_like
    where yc_id = ?`,
    id
);
exports.youtublogComLikeCount = (id) => doQuery(
    `select count(yc_id)
    as ycLikeCount
    from yc_like
    where yc_id = ?`,
    id
);
exports.youtublogComLikeCountByAuthor = (id) => doQuery(
    `select count(c.yc_id)
    as total from(
        select y.id, y.author, yl.yc_id
        from y_com
        as y
        inner join yc_like
        as yl
        on y.id = yl.yc_id
        where y.author = ?
    ) as c`,
    id
);
/* ===== insert ===== */
exports.insertYoutublogComLike = (yc_id, u_id) => doQuery(
    `INSERT INTO yc_like (yc_id, u_id)
    VALUES (?, ?)`,
    [yc_id, u_id]
);

/* ===== delete ===== */
exports.deleteYoutublogComLike = (id, u_id) => doQuery(
    `DELETE FROM yc_like
    WHERE yc_id = ?
    AND u_id = ?`,
    [id, u_id]
);