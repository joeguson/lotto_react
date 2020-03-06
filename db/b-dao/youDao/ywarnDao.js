const mysql = require('mysql');
const b = require('../../../b');
const pool = mysql.createPool(b.poolConfig);
const dbcon = require('../../dbconnection');

//query가 없을때에는?
function doQuery(query, args) {
    return dbcon.doQuery(pool, query, args);
}

/* ===== select ===== */
exports.youtublogWarnById = (u_id, id) => doQuery(
    `select u_id, y_id
    from y_warning
    where u_id = ?
    AND y_id = ?`,
    [u_id, id]
);
exports.youtublogComWarnById = (u_id, id) => doQuery(
    `select u_id, yc_id
    from yc_warning
    where u_id = ?
    AND yc_id = ?`,
    [u_id, id]
);
exports.youtublogComComWarnById = (u_id, id) => doQuery(
    `select u_id, ycc_id
    from ycc_warning
    where u_id = ?
    AND ycc_id = ?`,
    [u_id, id]
);
/* ===== insert ===== */
exports.insertYoutublogWarn = (y_id, u_id) => doQuery(
    `insert into y_warning(y_id, u_id)
    values(?, ?)`,
    [y_id, u_id]
);
exports.insertYoutublogComWarn = (yc_id, u_id) => doQuery(
    `insert into yc_warning(yc_id, u_id)
    values(?, ?)`,
    [yc_id, u_id]
);
exports.insertYoutublogComComWarn = (ycc_id, u_id) => doQuery(
    `insert into ycc_warning(ycc_id, u_id)
    values(?, ?)`,
    [ycc_id, u_id]
);
