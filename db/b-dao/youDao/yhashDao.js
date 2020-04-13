const daoUtil = require('../../daoUtil');

/* ===== select ===== */
exports.youtublogHashtagById = (id) => daoUtil.doQuery(
    `SELECT *
    FROM youtublog_hashtag
    where y_id = ?`,
    id
);
exports.youtublogSearchByHash = (hash) => daoUtil.doQuery(
    `select *
    from youtublog
    where id in
    (select distinct t_id from youtublog_hashtag where hash like ?)`,
    hash
);
/* ===== insert ===== */
exports.insertYoutublogHash = (y_id, hash) => daoUtil.doQuery(
    `INSERT INTO youtublog_hashtag (y_id, hash)
    VALUES (?, ?)`,
    [y_id, hash]
);
/* ===== delete ===== */
exports.deleteYoutublogHash = (id) => daoUtil.doQuery(
    `Delete from youtublog_hashtag
    where y_id = ?`,
    id
);
