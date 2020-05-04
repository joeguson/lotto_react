const daoUtil = require('../../daoUtil');

/* ===== select ===== */

exports.penobrolByAuthor = (id) => daoUtil.doQuery(
    `SELECT *
    from penobrol
    WHERE author = ?
    ORDER BY date DESC`,
    id
);
exports.penobrolByAuthorWithoutAnonim = (id) => daoUtil.doQuery(
    `SELECT *
    from penobrol
    WHERE author = (select id from users where u_id = ?)
    And public = 'p'
    ORDER BY date DESC`,
    id
);

exports.penobrolByRand = () => daoUtil.doQuery(
    `select p.*, u.u_id
    from penobrol as p
    join users as u on p.author = u.id
    order by rand()
    limit 4`
);
exports.penobrolSearch = (string) => daoUtil.doQuery(
    `SELECT *
    FROM penobrol
    AS result
    WHERE MATCH(title, content)
    AGAINST(?)`,
    [string]
);
exports.penobrolByDate = () => daoUtil.doQuery(
    `select p.*, u.u_id
    from penobrol as p
    join users as u on p.author = u.id
    order by date
    desc limit 3`
);
exports.penobrolByScore = () => daoUtil.doQuery(
    `select p.*, u.u_id
    from penobrol as p
    join users as u on p.author = u.id
    ORDER BY score
    DESC limit 3`
);
exports.penobrolById = (id) => daoUtil.doQuery( //select penobrol with userId
    `select p.*, u.u_id
    from penobrol as p
    join users as u on p.author = u.id
    where p.id = ?`,
    id
);

exports.cariPenobrol = () => daoUtil.doQuery( //select penobrol with userId
    `select *
    from (
    select *
    from penobrol 
    order by score
    desc 
    limit 15)p 
    order by rand() 
    limit 5`
);

/* ===== update ===== */

exports.updatePenobrol = (title, content, public, thumbnail, id) => daoUtil.doQuery(
    `UPDATE penobrol
    SET title = ?, content = ?, public = ?, thumbnail = ?
    where id = ?`,
    [title, content, public, thumbnail, id]
);
exports.updatePenobrolView = (id) => daoUtil.doQuery(
    `UPDATE penobrol
    SET p_view = p_view + 1
    WHERE id = ?`,
    id
);
exports.updatePenobrolScore = (id) => daoUtil.doQuery(
    `UPDATE penobrol
    SET score = (
        (select count(p_id) from p_com where p_id = ?) *.3
        + (select count(p_id) from p_like where p_id = ?)*.7
    )/p_view * 100
    where id = ?`,
    [id, id, id]
);
exports.updatePenobrolDate = (id) => daoUtil.doQuery(
    `UPDATE penobrol
    set changed_date = now()
    WHERE id = ?`,
    [id]
);
exports.updateChosenPcom = (id, chosen_id) => daoUtil.doQuery(
    `UPDATE penobrol
    set chosen = ?
    WHERE id = ?`,
    [chosen_id, id]
);

/* ===== insert ===== */
exports.insertPenobrol = (author, title, content, public, thumbnail) => daoUtil.doQuery(
    `INSERT INTO penobrol (author, title, content, public, thumbnail)
    VALUES (?, ?, ?, ?, ?)`,
    [author, title, content, public, thumbnail]
);

/* ===== delete ===== */
exports.deletePenobrol = (id) => daoUtil.doQuery(
    `Delete from penobrol
    where id = ?`,
    id
);