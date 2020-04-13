const daoUtil = require('../../daoUtil');

/* ===== select ===== */
exports.youtublogComComByYcId = (id) => daoUtil.doQuery(
    `SELECT y.*, u.u_id
    FROM yc_com as y
    join users as u
    on y.author = u.id
    WHERE y.yc_id = ?`,
    id
);
exports.youtublogComComById = (id) => daoUtil.doQuery(
    `select y.*, u.u_id
    from yc_com as y
    join users as u
    on y.author = u.id
    where y.id = ?`,
    id
);

/* ===== insert ===== */
exports.insertYoutublogComCom = (author, content, yc_id) => daoUtil.doQuery(
    `INSERT INTO yc_com (author, content, yc_id)
    VALUES (?, ?, ?)`,
    [author, content, yc_id]
);

/* ===== delete ===== */
exports.deleteYoutublogComCom = (id) => daoUtil.doQuery(
    `Delete from yc_com
    where id = ?`,
    id
);