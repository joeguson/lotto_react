const mysql = require('mysql');
const b = require('../../../b.js');
const pool = mysql.createPool(b.poolConfig);
const dbcon = require('../../dbconnection');

//query가 없을때에는?
function doQuery(query, args) {
    return dbcon.doQuery(pool, query, args);
}

/* ===== select ===== */
exports.youtublogComByScore = (id) => doQuery(
    `SELECT y.*, u.u_id
    FROM y_com as y
    join users as u on y.author = u.id
    WHERE y.y_id = ?
    order by score desc`,
    id
);
exports.youtublogComById = (id) => doQuery(
    `select *
    from y_com
    where id = ?`,
    id
);
exports.youtublogComCountById = (id) => doQuery(
    `select count(y_id)
    as count
    from y_com
    where y_id = ?`,
    id
);

/* ===== update ===== */
exports.updateYoutublogCom = (content, id, y_id) => doQuery(
    `UPDATE y_com
    SET content = ?, changed_date = now()
    where id = ?
    AND y_id = ?`,
    [content, id, y_id]
);
exports.updateYoutublogComScore = (yc_id) => doQuery(
    `UPDATE y_com
    set score = (
        (select count(yc_id) from yc_com where yc_id = ?) *.3
        + (select count(yc_id) from yc_like where yc_id = ?)*.7
    )/(select y_view from youtublog where id = y_id) * 100
    where id = ?`,
    [yc_id, yc_id, yc_id]
);

/* ===== insert ===== */
exports.insertYoutublogCom = (author, comment, y_id) => doQuery(
    `INSERT INTO y_com (author, content, y_id)
    VALUES (?, ?, ?)`,
    [author, comment, y_id]
);
/* ===== delete ===== */
exports.deleteYoutublogCom = (id) => doQuery(
    `Delete from y_com
    where id = ?`,
    id
);