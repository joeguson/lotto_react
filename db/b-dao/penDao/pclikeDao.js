const daoUtil = require('../../daoUtil');

/* ===== select ===== */
exports.penobrolComLikeById = (id) => daoUtil.doQuery(
    `SELECT *
    FROM pc_like
    where pc_id = ?`,
    id
);
exports.penobrolComLikeCount = (id) => daoUtil.doQuery(
    `select count(pc_id)
    as replyLikeCount
    from pc_like
    where pc_id = ?`,
    id
);
exports.penobrolComLikeByAuthor = (penobrolComId, userId) => daoUtil.doQuery(
    `SELECT COUNT(*) 
    AS count
    FROM pc_like
    WHERE pc_id = ? AND u_id = ?;`,
    [penobrolComId, userId]
);
exports.penobrolComLikeCountByAuthor = (id) => daoUtil.doQuery(
    `select count(c.pc_id)
    as total from(
        select p.id, p.author, pl.pc_id
        from p_com
        as p
        inner join pc_like
        as pl
        on p.id = pl.pc_id
        where p.author = ?
    )
    as c`,
    id
);

/* ===== insert ===== */
exports.insertPenobrolComLike = (pc_id, u_id) => daoUtil.doQuery(
    `INSERT INTO pc_like (pc_id, u_id)
    VALUES (?, ?)`,
    [pc_id, u_id]
);

/* ===== delete ===== */
exports.deletePenobrolComLike = (id, u_id) => daoUtil.doQuery(
    `DELETE FROM pc_like
    WHERE pc_id = ?
    AND u_id = ?`,
    [id, u_id]
);