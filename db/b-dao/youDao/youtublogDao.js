const daoUtil = require('../../daoUtil');
////////////////////////////////youtublog////////////////////////////////
////////////////Select////////////////
exports.youtublogByAuthor = (id) => daoUtil.doQuery(
    `SELECT *
    from youtublog
    WHERE author = ?
    ORDER BY date DESC`,
    id
);
exports.youtublogByAuthorWithoutAnonim = (id) => daoUtil.doQuery(
    `SELECT *
    from youtublog
    WHERE author = (select id from users where u_id = ?)
    And public = 'p'
    ORDER BY date DESC`,
    id
);
exports.youtublogByRand = () => daoUtil.doQuery(
    `select y.*, u.u_id
    from youtublog as y
    join users as u on y.author = u.id
    order by rand()
    limit 3`
);
exports.youtublogSearch = (string) => daoUtil.doQuery(
    `SELECT *
    FROM youtublog
    AS result
    WHERE MATCH(title, content)
    AGAINST(?)`,
    [string]
);
exports.youtublogByDate = () => daoUtil.doQuery(
    `select y.*, u.u_id
    from youtublog as y
    join users as u on y.author = u.id
    order by date
    desc limit 4`
);
exports.youtublogByScore = () => daoUtil.doQuery(
    `select y.*, u.u_id
    from youtublog as y
    join users as u on y.author = u.id
    ORDER BY score
    DESC limit 3`
);
exports.youtublogById = (id) => daoUtil.doQuery(
    `select y.*, u.u_id
    from youtublog as y
    join users as u
    on y.author = u.id
    where y.id = ?`,
    id
);
////////////////Update////////////////
exports.updateYoutublog = (title, content, public, thumbnail, id) => daoUtil.doQuery(
    `UPDATE youtublog
    SET title = ?, content = ?, public = ?, thumbnail = ?
    where id = ?`,
    [title, content, public, thumbnail, id]
);
exports.updateYoutublogView = (id) => daoUtil.doQuery(
    `UPDATE youtublog
    SET y_view = y_view + 1
    WHERE id = ?`,
    [id]
);
exports.updateYoutublogScore = (id) => daoUtil.doQuery(
    `UPDATE youtublog
    SET score = (
        (select count(y_id) from y_com where y_id = ?) *.3
        + (select count(y_id) from y_like where y_id = ?)*.7
    )/y_view * 100
    where id = ?`,
    [id, id, id]
);
exports.updateYoutublogDate = (id) => daoUtil.doQuery(
    `UPDATE youtublog
    set changed_date = now()
    WHERE id = ?`,
    [id]
);
////////////////Insert////////////////
exports.insertYoutublog = (author, title, content, public, thumbnail) => daoUtil.doQuery(
    `INSERT INTO youtublog(author, title, content, public, thumbnail)
    VALUES (?, ?, ?, ?, ?)`,
    [author, title, content, public, thumbnail]
);

////////////////Delete////////////////
exports.deleteYoutublog = (id) => daoUtil.doQuery(
    `Delete from youtublog
    where id = ?`,
    id
);
