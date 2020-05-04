const daoUtil = require('../../daoUtil');

/* ===== select ===== */
exports.tandyaByAuthor = (id) => daoUtil.doQuery(
    `SELECT *
    from tandya
    WHERE author = ?
    ORDER BY date DESC`,
    id
);
exports.tandyaByAuthorWithoutAnonim = (id) => daoUtil.doQuery(
    `SELECT *
    from tandya
    WHERE author = (select id from users where u_id = ?)
    And public = 'p'
    ORDER BY date DESC`,
    id
);
exports.tandyaByRand = () => daoUtil.doQuery(
    `select t.*, u.u_id
    from tandya as t
    join users as u on t.author = u.id
    order by rand()
    limit 4`
);
exports.tandyaSearch = (string) => daoUtil.doQuery(
    `SELECT *
    FROM tandya
    AS result
    WHERE MATCH(question, content)
    AGAINST(?)`,
    [string]
);
exports.tandyaByDate = () => daoUtil.doQuery(
    `select t.*, u.u_id
    from tandya as t
    join users as u on t.author = u.id
    order by date
    desc limit 3`
);
exports.tandyaByScore = () => daoUtil.doQuery(
    `select t.*, u.u_id
    from tandya as t
    join users as u on t.author = u.id
    ORDER BY score
    DESC limit 3`
);
exports.tandyaById = (id) => daoUtil.doQuery(
    `select t.*, u.u_id
    from tandya as t
    join users as u
    on t.author = u.id
    where t.id = ?`,
    id
);
exports.cariTandya = () => daoUtil.doQuery( //select penobrol with userId
    `select * 
    from (
    select * 
    from tandya 
    order by score 
    desc 
    limit 15)p 
    order by rand() 
    limit 5`
);

exports.updateTandya = (question, content, public, thumbnail, id) => daoUtil.doQuery(
    `UPDATE tandya
    SET question = ?, content = ?, public = ?, thumbnail = ?
    where id = ?`,
    [question, content, public, thumbnail, id]
);
exports.updateTandyaView = (id) => daoUtil.doQuery(
    `UPDATE tandya
    SET t_view = t_view + 1
    WHERE id = ?`,
    [id]
);
exports.updateTandyaScore = (id) => daoUtil.doQuery(
    `UPDATE tandya
    SET score = (
        (select count(t_id) from t_ans where t_id = ?) *.3
        + (select count(t_id) from t_like where t_id = ?)*.7
    )/t_view * 100
    where id = ?`,
    [id, id, id]
);
exports.updateTandyaDate = (id) => daoUtil.doQuery(
    `UPDATE tandya
    set changed_date = now()
    WHERE id = ?`,
    [id]
);
exports.updateChosenTans = (id, chosen_id) => daoUtil.doQuery(
    `UPDATE tandya
    set chosen = ?
    WHERE id = ?`,
    [chosen_id, id]
);

/* ===== insert ===== */
exports.insertTandya = (author, question, content, public, thumbnail) => daoUtil.doQuery(
    `INSERT INTO tandya(author, question, content, public, thumbnail)
    VALUES (?, ?, ?, ?, ?)`,
    [author, question, content, public, thumbnail]
);

/* ===== delete ===== */
exports.deleteTandya = (id) => daoUtil.doQuery(
    `Delete from tandya
    where id = ?`,
    id
);