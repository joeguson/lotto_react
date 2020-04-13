const daoUtil = require('../../daoUtil');

/* ===== select ===== */
exports.tandyaAnsComByTaId = (id) => daoUtil.doQuery(
        `SELECT t.*, u.u_id
    FROM ta_com as t
    join users as u
    on t.author = u.id
    WHERE t.ta_id = ?`,
    id
);
exports.tandyaAnsComById = (id) => daoUtil.doQuery(
        `select t.*, u.u_id
    from ta_com as t
    join users as u
    on t.author = u.id
    where t.id = ?`,
    id
);

/* ===== insert ===== */
exports.insertTandyaAnsCom = (author, content, ta_id) => daoUtil.doQuery(
        `INSERT INTO ta_com (author, content, ta_id)
    VALUES (?, ?, ?)`,
    [author, content, ta_id]
);

/* ===== delete ===== */
exports.deleteTandyaAnsCom = (id) => daoUtil.doQuery(
        `Delete from ta_com
    where id = ?`,
    id
);