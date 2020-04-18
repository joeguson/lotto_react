const daoUtil = require('../../daoUtil');

/* ===== select ===== */
exports.tandyaLikeById = (id) => daoUtil.doQuery(
    `SELECT *
    from t_like
    where t_id = ?`,
    id
);
exports.tandyaLikeCount = (id) => daoUtil.doQuery(
    `select count(t_id)
    as likeCount
    from t_like
    where t_id = ?`,
    id
);

exports.tandyaLikeByAuthor = (tandyaId, userId) => daoUtil.doQuery(
    `SELECT COUNT(*) 
    AS count
    FROM t_like
    WHERE t_id = ? AND u_id = ?`,
    [tandyaId, userId]
);

exports.tandyaLikeCountByAuthor = (id) => daoUtil.doQuery(
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
exports.insertTandyaLike = (t_id, u_id) => daoUtil.doQuery(
    `INSERT INTO t_like (t_id, u_id)
    VALUES (?, ?)`,
    [t_id, u_id]
);

/* ===== delete ===== */
exports.deleteTandyaLike = (id, u_id) => daoUtil.doQuery(
    `DELETE FROM t_like
    WHERE t_id = ?
    AND u_id = ?`,
    [id, u_id]
);