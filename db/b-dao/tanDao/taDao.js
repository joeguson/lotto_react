const daoUtil = require('../../daoUtil');

/* ===== select ===== */
exports.tandyaAnsByScore = (id) => daoUtil.doQuery(
    `SELECT t.*, u.u_id
    FROM t_ans as t
    join users as u on t.author = u.id
    WHERE t.t_id = ?
    order by score desc`,
    id
);
exports.tandyaAnsById = (id) => daoUtil.doQuery(
    `select t.*, u.u_id
    from t_ans as t
    join users as u on t.author = u.id
    where t.id = ?`,
    id
);
exports.tandyaAnsCountById = (id) => daoUtil.doQuery(
    `select count(t_id)
    as replyCount
    from t_ans
    where t_id = ?`,
    id
);

/* ===== update ===== */
exports.updateTandyaAns = (content, id, t_id) => daoUtil.doQuery(
    `UPDATE t_ans
    SET answer = ?, changed_date = now()
    where id = ?
    AND t_id = ?`,
    [content, id, t_id]
);
exports.updateTandyaAnsScore = (ta_id) => daoUtil.doQuery(
    `UPDATE t_ans
    set score = (
        (select count(ta_id) from ta_com where ta_id = ?) *.3
        + (select count(ta_id) from ta_like where ta_id = ?)*.7
    )/(select t_view from tandya where id = t_id) * 100
    where id = ?`,
    [ta_id, ta_id, ta_id]
);

/* ===== insert ===== */
exports.insertTandyaAns = (author, answer, t_id) => daoUtil.doQuery(
    `INSERT INTO t_ans (author, answer, t_id)
    VALUES (?, ?, ?)`,
    [author, answer, t_id]
);

/* ===== delete ===== */
exports.deleteTandyaAns = (id) => daoUtil.doQuery(
    `Delete from t_ans
    where id = ?`,
    id
);