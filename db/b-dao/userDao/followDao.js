const daoUtil = require('../../daoUtil');

/* ===== select ===== */

exports.select = (source, target) => daoUtil.doQuery( //target의 아이디는 현재 문자열 id로 숫자 id를 가져와야함
    `SELECT * FROM follow WHERE following = ? 
    AND followed = (SELECT id FROM users WHERE u_id = ?)`,
    [source, target]
);

exports.countFollower = (id) => daoUtil.doQuery(
  `select count(*)
    AS follower 
    from follow 
    where followed = ?`,
    id
);

exports.countFollowing = (id) => daoUtil.doQuery(
      `select count(*)
    AS following 
    from follow 
    where following = ?`,
    id
);

/* ===== insert ===== */
exports.insertFollowUser = (source, target) => daoUtil.doQuery(
    `INSERT INTO follow(following, followed) 
    VALUES (?, (SELECT id FROM users WHERE u_id = ?))
    ON DUPLICATE KEY UPDATE followed = ?`,
    [source, target, source]
);


/* ===== delete ===== */
exports.weeklyInsert = (id) => daoUtil.doQuery(
    `DELETE 
    FROM follow
    WHERE id = ?`,
    id
);

exports.deleteFollowUser = (source, target) => daoUtil.doQuery(
    `DELETE FROM follow 
    WHERE following=? 
    AND followed=(select id from users where u_id = ?)`,
    [source, target]
);