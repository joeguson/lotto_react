const daoUtil = require('../../daoUtil');

/* ===== select ===== */
exports.tandyaAnsLikeById = (id) => daoUtil.doQuery(
    `SELECT *
    from ta_like
    where ta_id = ?`,
    id
);
exports.tandyaAnsLikeCount = (id) => daoUtil.doQuery(
    `select count(ta_id)
    as likeCount
    from ta_like
    where ta_id = ?`,
    id
);
exports.tandyaAnsLikeByAuthor = (tandyaAnsId, userId) => daoUtil.doQuery(
    `SELECT COUNT(*) 
    AS count
    FROM ta_like
    WHERE ta_id = ? AND u_id = ?;`,
    [tandyaAnsId, userId]
);
exports.tandyaAnsLikeCountByAuthor = (id) => daoUtil.doQuery(
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
exports.insertTandyaAnsLike = (ta_id, u_id) => daoUtil.doQuery(
    `INSERT INTO ta_like (ta_id, u_id)
    VALUES (?, ?)`,
    [ta_id, u_id]
);

/* ===== delete ===== */
exports.deleteTandyaAnsLike = (id, u_id) => daoUtil.doQuery(
    `DELETE FROM ta_like
    WHERE ta_id = ?
    AND u_id = ?`,
    [id, u_id]
);