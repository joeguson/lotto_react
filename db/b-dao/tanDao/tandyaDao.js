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

////////////////////////////////Tandya Answer////////////////////////////////
////////////////Select////////////////
exports.tandyaAnsByScore = (id) => doQuery(
    `SELECT t.*, u.u_id
    FROM t_ans as t
    join users as u on t.author = u.id
    WHERE t.t_id = ?
    order by score desc`,
    id
);
exports.tandyaAnsById = (id) => doQuery(
    `select *
    from t_ans
    where id = ?`,
    id
);
exports.tandyaAnsCountById = (id) => doQuery(
    `select count(t_id)
    as count
    from t_ans
    where t_id = ?`,
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
exports.updateTandyaAnsScore = (ta_id) => doQuery(
    `UPDATE t_ans
    set score = (
        (select count(ta_id) from ta_com where ta_id = ?) *.3
        + (select count(ta_id) from ta_like where ta_id = ?)*.7
    )/(select t_view from tandya where id = t_id) * 100
    where id = ?`,
    [ta_id, ta_id, ta_id]
);
////////////////Insert////////////////
exports.insertTandyaAns = (author, answer, t_id) => doQuery(
    `INSERT INTO t_ans (author, answer, t_id)
    VALUES (?, ?, ?)`,
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
    join users as u
    on t.author = u.id
    WHERE t.ta_id = ?`,
    id
);
exports.tandyaAnsComById = (id) => doQuery(
    `select t.*, u.u_id
    from ta_com as t
    join users as u
    on t.author = u.id
    where t.id = ?`,
    id
);
////////////////Update////////////////

////////////////Insert////////////////
exports.insertTandyaAnsCom = (author, content, ta_id) => doQuery(
    `INSERT INTO ta_com (author, content, ta_id)
    VALUES (?, ?, ?)`,
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
exports.tandyaLikeCount = (id) => doQuery(
    `select count(t_id)
    as tlikeCount
    from t_like
    where t_id = ?`,
    id
);
exports.tandyaLikeCountByAuthor = (id) => doQuery(
    `select count(c.t_id)
    as total
    from(
        select t.id, t.author, tl.t_id
        from tandya
        as t
        inner join t_like
        as tl
        on t.id = tl.t_id
        where t.author = ?
    )
    as c`,
    id
);
exports.tandyaAnsLikeCount = (id) => doQuery(
    `select count(ta_id)
    as taLikeCount
    from ta_like
    where ta_id = ?`,
    id
);
exports.tandyaAnsLikeCountByAuthor = (id) => doQuery(
    `select count(c.ta_id)
    as total from(
        select t.id, t.author, tl.ta_id
        from t_ans
        as t
        inner join ta_like
        as tl
        on t.id = tl.ta_id
        where t.author = ?
    ) as c`,
    id
);
exports.tandyaWarnById = (u_id, id) => doQuery(
    `select u_id, t_id
    from t_warning
    where u_id = ?
    AND t_id = ?`,
    [u_id, id]
);
exports.tandyaAnsWarnById = (u_id, id) => doQuery(
    `select u_id, ta_id
    from ta_warning
    where u_id = ?
    AND ta_id = ?`,
    [u_id, id]
);
exports.tandyaAnsComWarnById = (u_id, id) => doQuery(
    `select u_id, tac_id
    from tac_warning
    where u_id = ?
    AND tac_id = ?`,
    [u_id, id]
);
exports.tandyaHashtagById = (id) => doQuery(
    `SELECT *
    FROM tandya_hashtag
    where t_id = ?`,
    id
);
exports.tandyaSearchByHash = (hash) => doQuery(
    `select *
    from tandya
    where id in
    (select distinct t_id from tandya_hashtag where hash like ?)`,
    hash
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
    VALUES (?, ?)`,
    [t_id, u_id]
);
exports.insertTandyaAnsLike = (ta_id, u_id) => doQuery(
    `INSERT INTO ta_like (ta_id, u_id)
    VALUES (?, ?)`,
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
exports.insertTandyaAnsComWarn = (tac_id, u_id) => doQuery(
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
exports.deleteTandyaAnsLike = (id, u_id) => doQuery(
    `DELETE FROM ta_like
    WHERE ta_id = ?
    AND u_id = ?`,
    [id, u_id]
);
exports.deleteTandyaLike = (id, u_id) => doQuery(
    `DELETE FROM t_like
    WHERE t_id = ?
    AND u_id = ?`,
    [id, u_id]
);
