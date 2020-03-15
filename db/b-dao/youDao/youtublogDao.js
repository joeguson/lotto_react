const mysql = require('mysql');
const b = require('../../../b.js');
const pool = mysql.createPool(b.poolConfig);
const dbcon = require('../../dbconnection');

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
    desc limit 4`
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
