const mysql = require('mysql');
const b = require('../../../b.js');
const pool = mysql.createPool(b.poolConfig);
const dbcon = require('../../dbconnection');

//arg가 없을때에는?
function doQuery(query, args) {
    return dbcon.doQuery(pool, query, args);
}
////////////////////////////////Tandya////////////////////////////////
////////////////Select////////////////
exports.tandyaByAuthor = (id) => doQuery(
    `SELECT *
    from tandya
    WHERE author = ?
    ORDER BY date DESC`,
    id
);
exports.tandyaByAuthorWithoutAnonim = (id) => doQuery(
    `SELECT *
    from tandya
    WHERE author = (select id from users where u_id = ?)
    And public = 'p'
    ORDER BY date DESC`,
    id
);
exports.tandyaByRand = () => doQuery(
    `select t.*, u.u_id
    from tandya as t
    join users as u on t.author = u.id
    order by rand()
    limit 3`
);
exports.tandyaSearch = (string) => doQuery(
    `SELECT *
    FROM tandya
    AS result
    WHERE MATCH(question, content)
    AGAINST(?)`,
    [string]
);
exports.tandyaByDate = () => doQuery(
    `select t.*, u.u_id
    from tandya as t
    join users as u on t.author = u.id
    order by date
    desc limit 3`
);
exports.tandyaByScore = () => doQuery(
    `select t.*, u.u_id
    from tandya as t
    join users as u on t.author = u.id
    ORDER BY score
    DESC limit 3`
);
exports.tandyaById = (id) => doQuery(
    `select t.*, u.u_id
    from tandya as t
    join users as u
    on t.author = u.id
    where t.id = ?`,
    id
);
////////////////Update////////////////
exports.updateTandya = (question, content, public, thumbnail, id) => doQuery(
    `UPDATE tandya
    SET question = ?, content = ?, public = ?, thumbnail = ?
    where id = ?`,
    [question, content, public, thumbnail, id]
);
exports.updateTandyaView = (id) => doQuery(
    `UPDATE tandya
    SET t_view = t_view + 1
    WHERE id = ?`,
    [id]
);
exports.updateTandyaScore = (id) => doQuery(
    `UPDATE tandya
    SET score = (
        (select count(t_id) from t_ans where t_id = ?) *.3
        + (select count(t_id) from t_like where t_id = ?)*.7
    )/t_view * 100
    where id = ?`,
    [id, id, id]
);
exports.updateTandyaDate = (id) => doQuery(
    `UPDATE tandya
    set changed_date = now()
    WHERE id = ?`,
    [id]
);
////////////////Insert////////////////
exports.insertTandya = (author, question, content, public, thumbnail) => doQuery(
    `INSERT INTO tandya(author, question, content, public, thumbnail)
    VALUES (?, ?, ?, ?, ?)`,
    [author, question, content, public, thumbnail]
);

////////////////Delete////////////////
exports.deleteTandya = (id) => doQuery(
    `Delete from tandya
    where id = ?`,
    id
);