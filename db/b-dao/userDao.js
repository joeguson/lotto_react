const mysql = require('mysql');
const b = require('../../b.js');
const pool = mysql.createPool(b.poolConfig);
const dbcon = require('../dbconnection');

function doQuery(query, args) {
  return dbcon.doQuery(pool, query, args);
}

////////////////Select////////////////
exports.matchCredential = (id, pw) => doQuery(
  `SELECT id, verify
  FROM users
  WHERE u_id=? AND u_pw= ?`,
  [id, pw]
);
exports.userInfoByEmail = (email) => doQuery(
    `SELECT id, u_id, verify
    FROM users
    WHERE email = ?`,
    email
);
exports.userInfoById = (id) => doQuery(
    `select u_id, date_format(u_bday,'%Y-%m-%d')as u_bday, sex, email
    from users
    where id = ?`,
    id
);
exports.userCountById = (id) => doQuery(
    `SELECT COUNT(u_id)
    AS total
    from users
    WHERE u_id = ?`,
    id
);
exports.userCountByEmail = (email) => doQuery(
    `SELECT COUNT(email)
    AS total
    from users
    WHERE email = ?`,
    email
);
exports.userBasicInfoById = (id) => doQuery(
    `select u_id, date_format(u_bday,'%Y-%m-%d') as u_bday, sex, email
    from users
    where u_id = ?`,
    id
);
exports.userBasicInfoByEmail = (email) => doQuery(
    `select u_id, date_format(u_bday,'%Y-%m-%d') as u_bday, sex, email
    from users
    where email = ?`,
    email
);
exports.userSearch = (string) => doQuery(
    `SELECT u_id
    FROM users
    AS result
    WHERE MATCH(u_id)
    AGAINST(?)`,
    [string]
);

////////////////Update////////////////
exports.updateLoginDate = (id) => doQuery(
    `UPDATE users
    SET last_login = NOW()
    WHERE u_id = ?`,
    id
);
exports.updateUserInfo = (pw, id) => doQuery(
    `update users
    set u_pw = ?
    where id = ?`,
    [pw, id]
);
exports.updateUserPw = (pw, id) => doQuery(
    `update users
    set u_pw = ?
    where u_id = ?`,
    [pw, id]
);
exports.verifyUser = (email) => doQuery(
    `UPDATE users
    set verify = 1, verify_date = NOW()
    where email = ?`,
    email
);
////////////////Insert////////////////
exports.insertUserInfo = (id, pw, bday, sex, email, verify) => doQuery(
    `INSERT INTO users
    (u_id, u_pw, u_bday, sex, email, verify)
    VALUES
    (?, ?, ?, ?, ?, ?)`,
    [id, pw, bday, sex, email, verify]
);
