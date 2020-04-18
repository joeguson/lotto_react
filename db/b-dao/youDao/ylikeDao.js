const daoUtil = require('../../daoUtil');

/* ===== select ===== */
exports.youtublogLikeById = (id) => daoUtil.doQuery(
    `SELECT *
    from y_like
    where y_id = ?`,
    id
);
exports.youtublogLikeCount = (id) => daoUtil.doQuery(
    `select count(y_id)
    as likeCount
    from y_like
    where y_id = ?`,
    id
);

exports.youtublogLikeByAuthor = (youtublogId, userId) => daoUtil.doQuery(
    `SELECT COUNT(*) 
    AS count
    FROM y_like
    WHERE y_id = ? AND u_id = ?;`,
    [youtublogId, userId]
);

exports.youtublogLikeCountByAuthor = (id) => daoUtil.doQuery(
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
exports.insertYoutublogLike = (y_id, u_id) => daoUtil.doQuery(
    `INSERT INTO y_like (y_id, u_id)
    VALUES (?, ?)`,
    [y_id, u_id]
);

/* ===== delete ===== */
exports.deleteYoutublogLike = (id, u_id) => daoUtil.doQuery(
    `DELETE FROM y_like
    WHERE y_id = ?
    AND u_id = ?`,
    [id, u_id]
);