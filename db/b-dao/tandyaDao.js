const mysql = require('mysql');
const b = require('../../b.js');
const pool = mysql.createPool(b.poolConfig);
const dbcon = require('../dbconnection');

//arg가 없을때에는?
function doQuery(query, args) {
    return dbcon.doQuery(pool, query, args);
}
////////////////////////////////Tandya////////////////////////////////
////////////////Select////////////////
exports.tandyaMaxId = () => doQuery(
    `SELECT MAX(id) AS max
    from tandya`
);
exports.tandyaById = (id) => doQuery(
    `select t.*, u.u_id
    from tandya as t
    join users as u on t.author = u.id
    where t.id = ?`,
    id
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
////////////////Update////////////////
exports.updateTandya = (question, content, public, id) => doQuery(
    `UPDATE tandya
    SET question = ?, content = ?, public = ?
    where id = ?`,
    [question, content, public, id]
);
exports.updateTandyaView = (id) => doQuery(
    `UPDATE tandya
    SET t_view = t_view + 1
    WHERE id = ?`,
    [id]
);
exports.updateTandyaScore = (id) => doQuery(
    `UPDATE tandya
    SET score = ((select count(t_id) from t_ans where t_id = ?) *.3 + (select count(t_id) from t_like where t_id = ?)*.7)/t_view * 100
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
    VALUES ((select id from users where u_id = ?), ?, ?, ?, ?)`,
    [author, question, content, public, thumbnail]
);

////////////////Delete////////////////
exports.deleteTandya = (id) => doQuery(
    `Delete from tandya
    where id = ?`,
    id
);

////////////////////////////////Tandya Answer////////////////////////////////
////////////////Select////////////////
exports.tandyaAnsByScore = (id) => doQuery(
    `SELECT t.*, u.u_id
    FROM t_ans as t join users as u on t.author = u.id
    WHERE t_id = ?
    order by score desc';`,
    id
);
exports.tandyaAnsById = (id) => doQuery(
    `select t.author, u.u_id
    from t_ans as t
    join users as u on t.author = u.id
    where t.id = ?`,
    id
);
////////////////Update////////////////
exports.updateTandyaAns = (content, id, t_id) => doQuery(
    `UPDATE t_ans
    SET answer = ?, changed_date = now()
    where id = ?
    AND t_id = ?`,
    [content, id, t_id]
);
exports.updateTandyaAnsScore = (id, t_id) => doQuery(
    `UPDATE t_ans
    set score = ((select count(ta_id) from ta_com where ta_id = ?) *.3 + (select count(ta_id) from ta_like where ta_id = ?)*.7)/(select t_view from tandya where id = ?) * 100
    where id = ?`,
    [id, id, t_id]
);
////////////////Insert////////////////
exports.insertTandyaAns = (author, answer, t_id) => doQuery(
    `INSERT INTO t_ans (author, answer, t_id)
    VALUES ((select id from users where u_id = ?), ?, ?)`,
    [author, answer, t_id]
);
////////////////Delete////////////////
exports.deleteTandyaAns = (id) => doQuery(
    `Delete from t_ans
    where id = ?`,
    id
);
////////////////////////////////Tandya Answer Comment////////////////////////////////
////////////////Select////////////////
exports.tandyaAnsComByTaId = (id) => doQuery(
    `SELECT t.*, u.u_id
    FROM ta_com as t
    join users as u on t.author = u.id
    WHERE t.ta_id = ?`,
    id
);
exports.tandyaAnsComById = (id) => doQuery(
    `select t.author, u.u_id
    from ta_com as t
    join users u on t.author = u.id
    where t.id = ?`,
    id
);
////////////////Update////////////////

////////////////Insert////////////////
exports.insertTandyaAnsCom = (author, content, ta_id) => doQuery(
    `INSERT INTO ta_com (author, content, ta_id)
    VALUES ((select id from users where u_id = ?), ?, ?)`,
    [author, content, ta_id]
);
////////////////Delete////////////////
exports.deleteTandyaAnsCom = (id) => doQuery(
    `Delete from ta_com
    where id = ?`,
    id
);
////////////////////////////////Tandya Hashtag&Like&Warn////////////////////////////////
////////////////Select////////////////
exports.tandyaLikeCount = (id) => doQuery(
    `select count(t_id)
    as tlikeCount
    from t_like
    where t_id = ?`,
    id
);
exports.tandyaAnsLikeCount = (id) => doQuery(
    `select count(ta_id)
    as taLikeCount
    from ta_like
    where ta_id = ?`,
    id
);
exports.tandyaWarningById = (u_id, id) => doQuery(
    `select u_id, t_id
    from t_warning
    where u_id = ?
    AND t_id = ?`,
    [u_id, id]
);
exports.tandyaAnsWarningById = (u_id, id) => doQuery(
    `select u_id, ta_id
    from ta_warning
    where u_id = ?
    AND ta_id = ?`,
    [u_id, id]
);
exports.tandyaAnsComWarningById = (u_id, id) => doQuery(
    `select u_id, tac_id
    from tac_warning
    where u_id = ?
    AND tac_id = ?`,
    [u_id, id]
);
exports.tandyaHashById = (id) => doQuery(
    `SELECT *
    FROM tandya_hashtag
    where t_id = ?`,
    id
);
exports.tandyaLikeById = (id) => doQuery(
    `SELECT *
    from t_like
    where t_id = ?`,
    id
);
exports.tandyaAnsLikeById = (id) => doQuery(
    `SELECT *
    from ta_like
    where ta_id = ?`,
    id
);
////////////////Update////////////////

////////////////Insert////////////////
exports.insertTandyaHash = (t_id, hash) => doQuery(
    `INSERT INTO tandya_hashtag (t_id, hash)
    VALUES (?, ?)`,
    [t_id, hash]
);
exports.insertTandyaLike = (t_id, u_id) => doQuery(
    `INSERT INTO t_like (t_id, u_id)
    VALUES (?, (select id from users where u_id = ?))`,
    [t_id, u_id]
);
exports.insertTandyaAnsLike = (ta_id, u_id) => doQuery(
    `INSERT INTO ta_like (ta_id, u_id)
    VALUES (?, (select id from users where u_id = ?))`,
    [ta_id, u_id]
);
exports.insertTandyaWarn = (t_id, u_id) => doQuery(
    `insert into t_warning(t_id, u_id)
    values(?, ?)`,
    [t_id, u_id]
);
exports.insertTandyaAnsWarn = (ta_id, u_id) => doQuery(
    `insert into ta_warning(ta_id, u_id)
    values(?, ?)`,
    [ta_id, u_id]
);
exports.insertTandyaAnsComWarn = (ta_id, u_id) => doQuery(
    `insert into tac_warning(tac_id, u_id)
    values(?, ?)`,
    [tac_id, u_id]
);
////////////////Delete////////////////
exports.deleteTandyaHash = (id) => doQuery(
    `Delete from tandya_hashtag
    where t_id = ?`,
    id
);
exports.deleteTandyaAnswerLike = (id, u_id) => doQuery(
    `DELETE FROM ta_like
    WHERE ta_id = ?
    AND u_id = (select id from users where u_id = ?)`,
    [id, u_id]
);
exports.deleteTandyaLike = (id, u_id) => doQuery(
    `DELETE FROM t_like
    WHERE t_id = ?
    AND u_id = (select id from users where u_id = ?)`,
    [id, u_id]
);
