const daoUtil = require('../../daoUtil');

/* ===== select ===== */
exports.penobrolComComByPcId = (id) => daoUtil.doQuery(
    `SELECT p.*, u.u_id
    FROM pc_com as p
    join users as u
    on p.author = u.id
    WHERE p.pc_id = ?`,
    id
);
exports.penobrolComComById = (id) => daoUtil.doQuery(
    `SELECT p.*, u.u_id
    FROM pc_com as p
    join users as u
    on p.author = u.id
    where p.id = ?`,
    id
);

/* ===== insert ===== */
exports.insertPenobrolComCom = (author, content, pc_id) => daoUtil.doQuery(
    `INSERT INTO pc_com (author, content, pc_id)
    VALUES (?, ?, ?)`,
    [author, content, pc_id]
);

/* ===== delete ===== */
exports.deletePenobrolComCom = (id) => daoUtil.doQuery(
    `Delete from pc_com
    where id = ?`,
    id
);