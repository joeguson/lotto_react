const daoUtil = require('../../daoUtil');

/* ===== select ===== */
exports.penobrolLikeById = (id) => daoUtil.doQuery(
    `SELECT *
    FROM p_like
    WHERE p_id = ?`,
    id
);

exports.penobrolLikeCount = (id) => daoUtil.doQuery(
    `select count(p_id)
    as articleLikeCount
    from p_like
    where p_id = ?`,
    id
);

exports.penobrolLikeByAuthor = (penobrolId, userId) => daoUtil.doQuery(
    `SELECT COUNT(*) 
    AS count
    FROM p_like
    WHERE p_id = ? AND u_id = ?;`,
    [penobrolId, userId]
);

exports.penobrolLikeCountByAuthor = (id) => daoUtil.doQuery(
    `select count(c.p_id)
    as total from(
        select p.id, p.author, pl.p_id
        from penobrol
        as p
        inner join p_like
        as pl
        on p.id = pl.p_id
        where p.author = ?
    )
    as c`,
    id
);

/* ===== insert ===== */
exports.insertPenobrolLike = (p_id, u_id) => daoUtil.doQuery(
    `INSERT INTO p_like (p_id, u_id)
    VALUES (?, ?)`,
    [p_id, u_id]
);

/* ===== delete ===== */
exports.deletePenobrolLike = (id, u_id) => daoUtil.doQuery(
    `DELETE FROM p_like
    WHERE p_id = ?
    AND u_id = ?`,
    [id, u_id]
);