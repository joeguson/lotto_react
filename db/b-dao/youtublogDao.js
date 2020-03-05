const mysql = require('mysql');
const b = require('../../b.js');
const pool = mysql.createPool(b.poolConfig);
const dbcon = require('../dbconnection');

//arg가 없을때에는?
function doQuery(query, args) {
    return dbcon.doQuery(pool, query, args);
}
////////////////////////////////youtublog////////////////////////////////
////////////////Select////////////////
exports.youtublogByAuthor = (id) => doQuery(
    `SELECT *
    from youtublog
    WHERE author = ?
    ORDER BY date DESC`,
    id
);
exports.youtublogByAuthorWithoutAnonim = (id) => doQuery(
    `SELECT *
    from youtublog
    WHERE author = (select id from users where u_id = ?)
    And public = 'p'
    ORDER BY date DESC`,
    id
);
exports.youtublogByRand = () => doQuery(
    `select y.*, u.u_id
    from youtublog as y
    join users as u on y.author = u.id
    order by rand()
    limit 3`
);
exports.youtublogSearch = (string) => doQuery(
    `SELECT *
    FROM youtublog
    AS result
    WHERE MATCH(title, content)
    AGAINST(?)`,
    [string]
);
exports.youtublogByDate = () => doQuery(
    `select y.*, u.u_id
    from youtublog as y
    join users as u on y.author = u.id
    order by date
    desc limit 3`
);
exports.youtublogByScore = () => doQuery(
    `select y.*, u.u_id
    from youtublog as y
    join users as u on y.author = u.id
    ORDER BY score
    DESC limit 3`
);
exports.youtublogById = (id) => doQuery(
    `select y.*, u.u_id
    from youtublog as y
    join users as u
    on y.author = u.id
    where y.id = ?`,
    id
);
////////////////Update////////////////
exports.updateYoutublog = (title, content, public, thumbnail, id) => doQuery(
    `UPDATE youtublog
    SET title = ?, content = ?, public = ?, thumbnail = ?
    where id = ?`,
    [title, content, public, thumbnail, id]
);
exports.updateYoutublogView = (id) => doQuery(
    `UPDATE youtublog
    SET y_view = y_view + 1
    WHERE id = ?`,
    [id]
);
exports.updateYoutublogScore = (id) => doQuery(
    `UPDATE youtublog
    SET score = (
        (select count(y_id) from y_com where y_id = ?) *.3
        + (select count(y_id) from y_like where y_id = ?)*.7
    )/y_view * 100
    where id = ?`,
    [id, id, id]
);
exports.updateYoutublogDate = (id) => doQuery(
    `UPDATE youtublog
    set changed_date = now()
    WHERE id = ?`,
    [id]
);
////////////////Insert////////////////
exports.insertYoutublog = (author, title, content, public, thumbnail) => doQuery(
    `INSERT INTO youtublog(author, title, content, public, thumbnail)
    VALUES (?, ?, ?, ?, ?)`,
    [author, title, content, public, thumbnail]
);

////////////////Delete////////////////
exports.deleteYoutublog = (id) => doQuery(
    `Delete from youtublog
    where id = ?`,
    id
);

////////////////////////////////youtublog Answer////////////////////////////////
////////////////Select////////////////
exports.youtublogComByScore = (id) => doQuery(
    `SELECT y.*, u.u_id
    FROM y_com as y
    join users as u on y.author = u.id
    WHERE y.y_id = ?
    order by score desc`,
    id
);
exports.youtublogComById = (id) => doQuery(
    `select *
    from y_com
    where id = ?`,
    id
);
exports.youtublogComCountById = (id) => doQuery(
    `select count(y_id)
    as count
    from y_ans
    where y_id = ?`,
    id
);
////////////////Update////////////////
exports.updateYoutublogCom = (content, id, y_id) => doQuery(
    `UPDATE y_com
    SET content = ?, changed_date = now()
    where id = ?
    AND y_id = ?`,
    [content, id, y_id]
);
exports.updateYoutublogComScore = (yc_id) => doQuery(
    `UPDATE y_com
    set score = (
        (select count(yc_id) from yc_com where yc_id = ?) *.3
        + (select count(yc_id) from yc_like where yc_id = ?)*.7
    )/(select y_view from youtublog where id = y_id) * 100
    where id = ?`,
    [yc_id, yc_id, yc_id]
);
////////////////Insert////////////////
exports.insertYoutublogCom = (author, comment, y_id) => doQuery(
    `INSERT INTO t_ans (author, content, y_id)
    VALUES (?, ?, ?)`,
    [author, comment, y_id]
);
////////////////Delete////////////////
exports.deleteYoutublogCom = (id) => doQuery(
    `Delete from y_com
    where id = ?`,
    id
);
////////////////////////////////youtublog Comment Comment////////////////////////////////
////////////////Select////////////////
exports.youtublogComComByYcId = (id) => doQuery(
    `SELECT y.*, u.u_id
    FROM yc_com as y
    join users as u
    on y.author = u.id
    WHERE y.yc_id = ?`,
    id
);
exports.youtublogComComById = (id) => doQuery(
    `select y.*, u.u_id
    from yc_com as y
    join users as u
    on y.author = u.id
    where y.id = ?`,
    id
);
////////////////Update////////////////

////////////////Insert////////////////
exports.insertYoutublogComCom = (author, content, yc_id) => doQuery(
    `INSERT INTO yc_com (author, content, yc_id)
    VALUES (?, ?, ?)`,
    [author, content, yc_id]
);
////////////////Delete////////////////
exports.deleteYoutublogComCom = (id) => doQuery(
    `Delete from yc_com
    where id = ?`,
    id
);
////////////////////////////////youtublog Hashtag&Like&Warn////////////////////////////////
////////////////Select////////////////
exports.youtublogLikeById = (id) => doQuery(
    `SELECT *
    from y_like
    where y_id = ?`,
    id
);
exports.youtublogComLikeById = (id) => doQuery(
    `SELECT *
    from yc_like
    where yc_id = ?`,
    id
);
exports.youtublogLikeCount = (id) => doQuery(
    `select count(y_id)
    as ylikeCount
    from y_like
    where y_id = ?`,
    id
);
exports.youtublogLikeCountByAuthor = (id) => doQuery(
    `select count(c.y_id)
    as total
    from(
        select y.id, y.author, yl.y_id
        from youtublog
        as y
        inner join y_like
        as yl
        on y.id = yl.y_id
        where y.author = ?
    )
    as c`,
    id
);
exports.youtublogComLikeCount = (id) => doQuery(
    `select count(yc_id)
    as ycLikeCount
    from yc_like
    where yc_id = ?`,
    id
);
exports.youtublogComLikeCountByAuthor = (id) => doQuery(
    `select count(c.yc_id)
    as total from(
        select y.id, y.author, yl.yc_id
        from y_com
        as y
        inner join yc_like
        as yl
        on y.id = yl.yc_id
        where y.author = ?
    ) as c`,
    id
);
exports.youtublogWarnById = (u_id, id) => doQuery(
    `select u_id, y_id
    from y_warning
    where u_id = ?
    AND y_id = ?`,
    [u_id, id]
);
exports.youtublogComWarnById = (u_id, id) => doQuery(
    `select u_id, yc_id
    from yc_warning
    where u_id = ?
    AND yc_id = ?`,
    [u_id, id]
);
exports.youtublogComComWarnById = (u_id, id) => doQuery(
    `select u_id, ycc_id
    from ycc_warning
    where u_id = ?
    AND ycc_id = ?`,
    [u_id, id]
);
exports.youtublogHashtagById = (id) => doQuery(
    `SELECT *
    FROM youtublog_hashtag
    where y_id = ?`,
    id
);
exports.youtublogSearchByHash = (hash) => doQuery(
    `select *
    from youtublog
    where id in
    (select distinct t_id from youtublog_hashtag where hash like ?)`,
    hash
);
////////////////Update////////////////

////////////////Insert////////////////
exports.insertYoutublogHash = (y_id, hash) => doQuery(
    `INSERT INTO youtublog_hashtag (y_id, hash)
    VALUES (?, ?)`,
    [y_id, hash]
);
exports.insertYoutublogLike = (y_id, u_id) => doQuery(
    `INSERT INTO y_like (y_id, u_id)
    VALUES (?, ?)`,
    [y_id, u_id]
);
exports.insertYoutublogComLike = (yc_id, u_id) => doQuery(
    `INSERT INTO yc_like (yc_id, u_id)
    VALUES (?, ?)`,
    [yc_id, u_id]
);
exports.insertYoutublogWarn = (y_id, u_id) => doQuery(
    `insert into y_warning(y_id, u_id)
    values(?, ?)`,
    [y_id, u_id]
);
exports.insertYoutublogComWarn = (yc_id, u_id) => doQuery(
    `insert into yc_warning(yc_id, u_id)
    values(?, ?)`,
    [yc_id, u_id]
);
exports.insertYoutublogComComWarn = (ycc_id, u_id) => doQuery(
    `insert into ycc_warning(ycc_id, u_id)
    values(?, ?)`,
    [ycc_id, u_id]
);
////////////////Delete////////////////
exports.deleteYoutublogHash = (id) => doQuery(
    `Delete from youtublog_hashtag
    where y_id = ?`,
    id
);
exports.deleteYoutublogComLike = (id, u_id) => doQuery(
    `DELETE FROM yc_like
    WHERE yc_id = ?
    AND u_id = ?`,
    [id, u_id]
);
exports.deleteYoutublogLike = (id, u_id) => doQuery(
    `DELETE FROM y_like
    WHERE y_id = ?
    AND u_id = ?`,
    [id, u_id]
);
