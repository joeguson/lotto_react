const mysql = require('mysql');
const b = require('../../../b');
const pool = mysql.createPool(b.poolConfig);
const dbcon = require('../../dbconnection');

//query가 없을때에는?
function doQuery(query, args) {
    return dbcon.doQuery(pool, query, args);
}
////////////////////////////////Penobrol////////////////////////////////
////////////////Select////////////////
exports.penobrolByAuthor = (id) => doQuery(
    `SELECT *
    from penobrol
    WHERE author = ?
    ORDER BY date DESC`,
    id
);
exports.penobrolByAuthorWithoutAnonim = (id) => doQuery(
    `SELECT *
    from penobrol
    WHERE author = (select id from users where u_id = ?)
    And public = 'p'
    ORDER BY date DESC`,
    id
);

exports.penobrolByRand = () => doQuery(
    `select p.*, u.u_id
    from penobrol as p
    join users as u on p.author = u.id
    order by rand()
    limit 3`
);
exports.penobrolSearch = (string) => doQuery(
    `SELECT *
    FROM penobrol
    AS result
    WHERE MATCH(title, content)
    AGAINST(?)`,
    [string]
);
exports.penobrolByDate = () => doQuery(
    `select p.*, u.u_id
    from penobrol as p
    join users as u on p.author = u.id
    order by date
    desc limit 3`
);
exports.penobrolByScore = () => doQuery(
    `select p.*, u.u_id
    from penobrol as p
    join users as u on p.author = u.id
    ORDER BY score
    DESC limit 3`
);
exports.penobrolById = (id) => doQuery( //select penobrol with userId
    `select p.*, u.u_id
    from penobrol as p
    join users as u on p.author = u.id
    where p.id = ?`,
    id
);
////////////////Update////////////////
exports.updatePenobrol = (title, content, public, thumbnail, id) => doQuery(
    `UPDATE penobrol
    SET title = ?, content = ?, public = ?, thumbnail = ?
    where id = ?`,
    [title, content, public, thumbnail, id]
);
exports.updatePenobrolView = (id) => doQuery(
    `UPDATE penobrol
    SET p_view = p_view + 1
    WHERE id = ?`,
    id
);
exports.updatePenobrolScore = (id) => doQuery(
    `UPDATE penobrol
    SET score = (
        (select count(p_id) from p_com where p_id = ?) *.3
        + (select count(p_id) from p_like where p_id = ?)*.7
    )/p_view * 100
    where id = ?`,
    [id, id, id]
);
exports.updatePenobrolDate = (id) => doQuery(
    `UPDATE penobrol
    set changed_date = now()
    WHERE id = ?`,
    [id]
);
////////////////Insert////////////////
exports.insertPenobrol = (author, title, content, public, thumbnail) => doQuery(
    `INSERT INTO penobrol (author, title, content, public, thumbnail)
    VALUES (?, ?, ?, ?, ?)`,
    [author, title, content, public, thumbnail]
);
////////////////Delete////////////////
exports.deletePenobrol = (id) => doQuery(
    `Delete from penobrol
    where id = ?`,
    id
);

////////////////////////////////Penobrol Comment////////////////////////////////
////////////////Select////////////////
exports.penobrolComByScore = (id) => doQuery(
    `SELECT p.*, u.u_id
    FROM p_com as p
    join users as u on p.author = u.id
    WHERE p.p_id = ?
    order by score desc`,
    id
);
exports.penobrolComById = (id) => doQuery(
    `select *
    from p_com
    where id = ?`,
    id
);
exports.penobrolComCountById = (id) => doQuery(
    `select count(p_id)
    as count
    from p_com
    where p_id = ?`,
    id
);
////////////////Update////////////////
exports.updatePenobrolCom = (content, id, p_id) => doQuery(
    `UPDATE p_com
    SET content = ?, changed_date = now()
    where id = ?
    AND p_id = ?`
    [content, id, p_id]
);
exports.updatePenobrolComScore = (pc_id, p_id) => doQuery(
    `UPDATE p_com
    set score = (
        (select count(pc_id) from pc_com where pc_id = ?) *.3
        + (select count(pc_id) from pc_like where pc_id = ?)*.7
    )/(select p_view from penobrol where id = ?) * 100
    where id = ?`,
    [pc_id, pc_id, p_id, pc_id]
);
////////////////Insert////////////////
exports.insertPenobrolCom = (author, content, p_id) => doQuery(
    `INSERT INTO p_com (author, content, p_id)
    VALUES (?, ?, ?)`,
    [author, content, p_id]
);
////////////////Delete////////////////
exports.deletePenobrolCom = (id) => doQuery(
    `Delete from p_com
    where id = ?`,
    id
);
////////////////////////////////Penobrol Comment Comment////////////////////////////////
////////////////Select////////////////
exports.penobrolComComByPcId = (id) => doQuery(
    `SELECT p.*, u.u_id
    FROM pc_com as p
    join users as u
    on p.author = u.id
    WHERE p.pc_id = ?`,
    id
);
exports.penobrolComComById = (id) => doQuery(
    `SELECT p.*, u.u_id
    FROM pc_com as p
    join users as u
    on p.author = u.id
    where p.id = ?`,
    id
);
////////////////Update////////////////

////////////////Insert////////////////
exports.insertPenobrolComCom = (author, content, pc_id) => doQuery(
    `INSERT INTO pc_com (author, content, pc_id)
    VALUES (?, ?, ?)`,
    [author, content, pc_id]
);
////////////////Delete////////////////
exports.deletePenobrolComCom = (id) => doQuery(
    `Delete from pc_com
    where id = ?`,
    id
);
////////////////////////////////Penobrol Hashtag&Like&Warn////////////////////////////////
////////////////Select////////////////
exports.penobrolLikeById = (id) => doQuery(
    `SELECT *
    FROM p_like
    WHERE p_id = ?`,
    id
);
exports.penobrolComLikeById = (id) => doQuery(
    `SELECT *
    FROM pc_like
    where pc_id = ?`,
    id
);
exports.penobrolLikeCount = (id) => doQuery(
    `select count(p_id)
    as plikeCount
    from p_like
    where p_id = ?`,
    id
);
exports.penobrolLikeCountByAuthor = (id) => doQuery(
    `select count(c.p_id)
    as total from(
        select p.id, p.author, pl.p_id
        from penobrol
        as p
        inner join p_like
        as pl
        on p.id = pl.p_id
        where p.author = ?
    )
    as c`,
    id
);
exports.penobrolComLikeCount = (id) => doQuery(
    `select count(pc_id)
    as pcLikeCount
    from pc_like
    where pc_id = ?`,
    id
);
exports.penobrolComLikeCountByAuthor = (id) => doQuery(
    `select count(c.pc_id)
    as total from(
        select p.id, p.author, pl.pc_id
        from p_com
        as p
        inner join pc_like
        as pl
        on p.id = pl.pc_id
        where p.author = ?
    )
    as c`,
    id
);
exports.penobrolWarnById = (id, userId) => doQuery(
    `select u_id, p_id
    from p_warning
    where u_id = ?
    AND p_id = ?`,
    [userId, id]
);
exports.penobrolComWarnById = (id, userId) => doQuery(
    `select u_id, pc_id
    from pc_warning
    where u_id = ?
    AND pc_id = ?`,
    [userId, id]
);
exports.penobrolComComWarnById = (id, userId) => doQuery(
    `select u_id, pcc_id
    from pcc_warning
    where u_id = ?
    AND pcc_id = ?`,
    [userId, id]
);
exports.penobrolHashtagById = (id) => doQuery(
    `select *
    from penobrol_hashtag
    where p_id = ?`,
    id
);
exports.penobrolSearchByHash = (hash) => doQuery(
    `select *
    from penobrol
    where id in
    (select distinct p_id from penobrol_hashtag where hash like ?)`,
    hash
);
////////////////Update////////////////

////////////////Insert////////////////
exports.insertPenobrolHash = (id, hash) => doQuery(
    `INSERT INTO penobrol_hashtag (p_id, hash)
    VALUES (?, ?)`,
    [id, hash]
);
exports.insertPenobrolLike = (p_id, u_id) => doQuery(
    `INSERT INTO p_like (p_id, u_id)
    VALUES (?, ?)`,
    [p_id, u_id]
);
exports.insertPenobrolComLike = (pc_id, u_id) => doQuery(
    `INSERT INTO pc_like (pc_id, u_id)
    VALUES (?, ?)`,
    [pc_id, u_id]
);
exports.insertPenobrolWarn = (u_id, p_id) => doQuery(
    `insert into p_warning(u_id, p_id)
    values(?, ?)`,
    [u_id, p_id]
);
exports.insertPenobrolComWarn = (u_id, pc_id) => doQuery(
    `insert into pc_warning(u_id, pc_id)
    values(?, ?)`,
    [u_id, pc_id]
);

exports.insertPenobrolComComWarn = (u_id, pcc_id) => doQuery(
    `insert into pcc_warning(u_id, pcc_id)
    values(?, ?)`,
    [u_id, pcc_id]
);
////////////////Delete////////////////
exports.deletePenobrolHash = (id) => doQuery(
    `Delete from penobrol_hashtag
    where p_id = ?`,
    id
);
exports.deletePenobrolLike = (id, u_id) => doQuery(
    `DELETE FROM p_like
    WHERE p_id = ?
    AND u_id = ?`,
    [id, u_id]
);
exports.deletePenobrolComLike = (id, u_id) => doQuery(
    `DELETE FROM pc_like
    WHERE pc_id = ?
    AND u_id = ?`,
    [id, u_id]
);
