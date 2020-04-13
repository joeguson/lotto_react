const daoUtil = require('../../daoUtil');

/* ===== select ===== */
exports.penobrolHashtagById = (id) => daoUtil.doQuery(
    `select *
    from penobrol_hashtag
    where p_id = ?`,
    id
);
exports.penobrolSearchByHash = (hash) => daoUtil.doQuery(
    `select *
    from penobrol
    where id in
    (select distinct p_id from penobrol_hashtag where hash like ?)`,
    hash
);

/* ===== insert ===== */
exports.insertPenobrolHash = (id, hash) => daoUtil.doQuery(
    `INSERT INTO penobrol_hashtag (p_id, hash)
    VALUES (?, ?)`,
    [id, hash]
);

/* ===== delete ===== */
exports.deletePenobrolHash = (id) => daoUtil.doQuery(
    `Delete from penobrol_hashtag
    where p_id = ?`,
    id
);
