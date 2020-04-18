const daoUtil = require('../../daoUtil');

/* ===== select ===== */
exports.youtublogComByScore = (id) => daoUtil.doQuery(
    `SELECT y.*, u.u_id
    FROM y_com as y
    join users as u on y.author = u.id
    WHERE y.y_id = ?
    order by score desc`,
    id
);
exports.youtublogComById = (id) => daoUtil.doQuery(
    `select y.*, u.u_id
    from y_com as y
    join users as u on y.author = u.id
    where y.id = ?`,
    id
);
exports.youtublogComCountById = (id) => daoUtil.doQuery(
    `select count(y_id)
    as replyCount
    from y_com
    where y_id = ?`,
    id
);

/* ===== update ===== */
exports.updateYoutublogCom = (content, id, y_id) => daoUtil.doQuery(
    `UPDATE y_com
    SET content = ?, changed_date = now()
    where id = ?
    AND y_id = ?`,
    [content, id, y_id]
);
exports.updateYoutublogComScore = (yc_id) => daoUtil.doQuery(
    `UPDATE y_com
    set score = (select count(yc_id) from yc_com where yc_id = ?) *.4
        + (select count(yc_id) from yc_like where yc_id = ?)*.6
    where id = ?`,
    [yc_id, yc_id, yc_id]
);

/* ===== insert ===== */
exports.insertYoutublogCom = (author, comment, y_id) => daoUtil.doQuery(
    `INSERT INTO y_com (author, content, y_id)
    VALUES (?, ?, ?)`,
    [author, comment, y_id]
);
/* ===== delete ===== */
exports.deleteYoutublogCom = (id) => daoUtil.doQuery(
    `Delete from y_com
    where id = ?`,
    id
);