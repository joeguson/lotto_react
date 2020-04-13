const daoUtil = require('../../daoUtil');

/* ===== select ===== */
exports.tandyaHashtagById = (id) => daoUtil.doQuery(
    `SELECT *
    FROM tandya_hashtag
    where t_id = ?`,
    id
);
exports.tandyaSearchByHash = (hash) => daoUtil.doQuery(
    `select *
    from tandya
    where id in
    (select distinct t_id from tandya_hashtag where hash like ?)`,
    hash
);

/* ===== update ===== */

/* ===== insert ===== */
exports.insertTandyaHash = (t_id, hash) => daoUtil.doQuery(
    `INSERT INTO tandya_hashtag (t_id, hash)
    VALUES (?, ?)`,
    [t_id, hash]
);

/* ===== delete ===== */
exports.deleteTandyaHash = (id) => daoUtil.doQuery(
    `Delete from tandya_hashtag
    where t_id = ?`,
    id
);