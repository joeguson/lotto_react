const mysql = require('mysql');
const b = require('../../../b.js');
const pool = mysql.createPool(b.poolConfig);
const dbcon = require('../../dbconnection');

//query가 없을때에는?
function doQuery(query, args) {
    return dbcon.doQuery(pool, query, args);
}

/* ===== select ===== */
exports.penobrolComLikeById = (id) => doQuery(
    `SELECT *
    FROM pc_like
    where pc_id = ?`,
    id
);
exports.penobrolComLikeCount = (id) => doQuery(
    `select count(pc_id)
    as replyLikeCount
    from pc_like
    where pc_id = ?`,
    id
);
exports.penobrolComLikeByAuthor = (penobrolComId, userId) => doQuery(
    `SELECT COUNT(*) 
    AS count
    FROM pc_like
    WHERE pc_id = ? AND u_id = ?;`,
    [penobrolComId, userId]
);
exports.penobrolComLikeCountByAuthor = (id) => doQuery(
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
exports.insertPenobrolComLike = (pc_id, u_id) => doQuery(
    `INSERT INTO pc_like (pc_id, u_id)
    VALUES (?, ?)`,
    [pc_id, u_id]
);

/* ===== delete ===== */
exports.deletePenobrolComLike = (id, u_id) => doQuery(
    `DELETE FROM pc_like
    WHERE pc_id = ?
    AND u_id = ?`,
    [id, u_id]
);