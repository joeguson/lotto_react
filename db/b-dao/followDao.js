const mysql = require('mysql');
const b = require('../../b.js');
const pool = mysql.createPool(b.poolConfig);
const dbcon = require('../dbconnection');

function doQuery(query, args) {
  return dbcon.doQuery(pool, query, args);
}


/* ===== select ===== */

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
    `insert into follow(followed, following) 
    values(
    ?, (select id from users where u_id = ?))`,
    [source, target]
);


/* ===== delete ===== */
exports.weeklyInsert = (id) => doQuery(
    `DELETE 
    FROM follow
    WHERE id = ?`,
    id
);