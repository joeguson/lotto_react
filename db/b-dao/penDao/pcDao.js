const daoUtil = require('../../daoUtil');

/* ===== select ===== */
exports.penobrolComByScore = (id) => daoUtil.doQuery(
    `SELECT p.*, u.u_id
    FROM p_com as p
    join users as u on p.author = u.id
    WHERE p.p_id = ?
    order by score desc`,
    id
);
exports.penobrolComById = (id) => daoUtil.doQuery(
    `select p.*, u.u_id
    from p_com as p
    join users as u on p.author = u.id
    where p.id = ?`,
    id
);
exports.penobrolComCountById = (id) => daoUtil.doQuery(
    `select count(p_id)
    as replyCount
    from p_com
    where p_id = ?`,
    id
);


/* ===== update ===== */
exports.updatePenobrolCom = (content, id, p_id) => daoUtil.doQuery(
    `UPDATE p_com
    SET content = ?, changed_date = now()
    where id = ?
    AND p_id = ?`,
    [content, id, p_id]
);
exports.updatePenobrolComScore = (pc_id) => daoUtil.doQuery(
    `UPDATE p_com
    set score = (select count(pc_id) from pc_com where pc_id = ?) *.4
        + (select count(pc_id) from pc_like where pc_id = ?)*.6
    where id = ?`,
    [pc_id, pc_id, pc_id]
);

/* ===== insert ===== */
exports.insertPenobrolCom = (author, content, p_id) => daoUtil.doQuery(
    `INSERT INTO p_com (author, content, p_id)
    VALUES (?, ?, ?)`,
    [author, content, p_id]
);

/* ===== delete ===== */
exports.deletePenobrolCom = (id) => daoUtil.doQuery(
    `Delete from p_com
    where id = ?`,
    id
);