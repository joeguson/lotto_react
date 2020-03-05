const mysql = require('mysql');
const b = require('../../../b.js');
const pool = mysql.createPool(b.poolConfig);
const dbcon = require('../../dbconnection');

//query가 없을때에는?
function doQuery(query, args) {
    return dbcon.doQuery(pool, query, args);
}

/* ===== select ===== */
exports.penobrolComByScore = (id) => doQuery(
    `SELECT p.*, u.u_id
    FROM p_com as p
    join users as u on p.author = u.id
    WHERE p.p_id = ?
    order by score desc`,
    id
);
exports.penobrolComById = (id) => doQuery(
    `select *
    from p_com
    where id = ?`,
    id
);
exports.penobrolComCountById = (id) => doQuery(
    `select count(p_id)
    as count
    from p_com
    where p_id = ?`,
    id
);

/* ===== update ===== */
exports.updatePenobrolCom = (content, id, p_id) => doQuery(
    `UPDATE p_com
    SET content = ?, changed_date = now()
    where id = ?
    AND p_id = ?`
        [content, id, p_id]
);
exports.updatePenobrolComScore = (pc_id, p_id) => doQuery(
    `UPDATE p_com
    set score = (
        (select count(pc_id) from pc_com where pc_id = ?) *.3
        + (select count(pc_id) from pc_like where pc_id = ?)*.7
    )/(select p_view from penobrol where id = ?) * 100
    where id = ?`,
    [pc_id, pc_id, p_id, pc_id]
);

/* ===== insert ===== */
exports.insertPenobrolCom = (author, content, p_id) => doQuery(
    `INSERT INTO p_com (author, content, p_id)
    VALUES (?, ?, ?)`,
    [author, content, p_id]
);

/* ===== delete ===== */
exports.deletePenobrolCom = (id) => doQuery(
    `Delete from p_com
    where id = ?`,
    id
);