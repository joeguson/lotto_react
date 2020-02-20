const mysql = require('mysql');
const b = require('../../b.js');
const pool = mysql.createPool(b.poolConfig);
const dbcon = require('../dbconnection');

function doQuery(query, args) {
  return dbcon.doQuery(pool, query, args);
}


/* ===== select ===== */

exports.select = (source, target) => doQuery( //target의 아이디는 현재 문자열 id로 숫자 id를 가져와야함
    `SELECT * FROM follow WHERE following = ? 
    AND followed = (SELECT id FROM users WHERE u_id = ?)`,
    [source, target]
);

exports.countFollower = (id) => doQuery(
  `select count(*)
    AS follower 
    from follow 
    where id = ?`,
    id
);

exports.countFollowing = (id) => doQuery(
      `select count(*)
    AS following 
    from follow 
    where id = ?`,
    id
);

/* ===== insert ===== */
exports.insertFollowUser = (source, target) => doQuery(
    `INSERT INTO follow(following, followed) 
    VALUES (?, (SELECT id FROM users WHERE u_id = ?))
    ON DUPLICATE KEY UPDATE followed = ?`,
    [source, target, source]
);


/* ===== delete ===== */
exports.weeklyInsert = (id) => doQuery(
    `DELETE 
    FROM follow
    WHERE id = ?`,
    id
);

exports.deleteFollowUser = (source, target) => doQuery(
    `DELETE FROM follow WHERE following=? AND followed=(select id from users where u_id = ?)`,
    [source, target]
);