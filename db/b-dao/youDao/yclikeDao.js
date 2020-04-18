const daoUtil = require('../../daoUtil');

/* ===== select ===== */
exports.youtublogComLikeById = (id) => daoUtil.doQuery(
    `SELECT *
    from yc_like
    where yc_id = ?`,
    id
);
exports.youtublogComLikeCount = (id) => daoUtil.doQuery(
    `select count(yc_id)
    as likeCount
    from yc_like
    where yc_id = ?`,
    id
);
exports.youtublogComLikeByAuthor = (youtublogComId, userId) => daoUtil.doQuery(
    `SELECT COUNT(*) 
    AS count
    FROM yc_like
    WHERE yc_id = ? AND u_id = ?;`,
    [youtublogComId, userId]
);
exports.youtublogComLikeCountByAuthor = (id) => daoUtil.doQuery(
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
exports.insertYoutublogComLike = (yc_id, u_id) => daoUtil.doQuery(
    `INSERT INTO yc_like (yc_id, u_id)
    VALUES (?, ?)`,
    [yc_id, u_id]
);

/* ===== delete ===== */
exports.deleteYoutublogComLike = (id, u_id) => daoUtil.doQuery(
    `DELETE FROM yc_like
    WHERE yc_id = ?
    AND u_id = ?`,
    [id, u_id]
);