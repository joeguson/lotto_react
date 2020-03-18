const mysql = require('mysql');
const b = require('../../../b.js');
const pool = mysql.createPool(b.poolConfig);
const dbcon = require('../../dbconnection');

//query가 없을때에는?
function doQuery(query, args) {
    return dbcon.doQuery(pool, query, args);
}

/* ===== select ===== */
exports.penobrolLikeById = (id) => doQuery(
    `SELECT *
    FROM p_like
    WHERE p_id = ?`,
    id
);

exports.penobrolLikeCount = (id) => doQuery(
    `select count(p_id)
    as plikeCount
    from p_like
    where p_id = ?`,
    id
);

exports.penobrolLikeByAuthor = (penobrolId, userId) => doQuery(
    `SELECT COUNT(*) 
    AS count
    FROM p_like
    WHERE p_id = ? AND u_id = ?;`,
    [penobrolId, userId]
);

exports.penobrolLikeCountByAuthor = (id) => doQuery(
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
exports.insertPenobrolLike = (p_id, u_id) => doQuery(
    `INSERT INTO p_like (p_id, u_id)
    VALUES (?, ?)`,
    [p_id, u_id]
);

/* ===== delete ===== */
exports.deletePenobrolLike = (id, u_id) => doQuery(
    `DELETE FROM p_like
    WHERE p_id = ?
    AND u_id = ?`,
    [id, u_id]
);