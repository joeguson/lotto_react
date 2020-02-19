const mysql = require('mysql');
const b = require('../../b.js');
const pool = mysql.createPool(b.poolConfig);
const dbcon = require('../dbconnection');

function doQuery(query, args) {
  return dbcon.doQuery(pool, query, args);
}


/* ===== select ===== */

exports.select = (source, target) => doQuery(
    `SELECT * FROM follow WHERE following=? AND followed=?`,
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
    VALUES (?, ?)
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
    `DELETE FROM follow WHERE following=? AND followed=?`,
    [source, target]
);