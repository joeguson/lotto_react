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
    `SELECT COUNT(email) AS total
    from users
    WHERE email = ?`,
    email
);
exports.userInfoById = (id) => doQuery(
    `select u_id, date_format(u_bday,'%Y-%m-%d')as u_bday, sex, email
    from users
    where id = ?`,
    id
);
////////////////Update////////////////
exports.updateLoginDate = (id) => doQuery(
    `UPDATE users
    SET last_login = NOW()
    WHERE u_id = ?`,
    id
);
exports.updateUserInfo = (id, pw, bday, gender) => doQuery(
    `update users
    set u_pw = ?,
    u_bday = ?,
    sex = ?
    where id = ?`,
    [pw, bday, gender, id]
);
exports.updateUserPw = (id, pw) => doQuery(
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
exports.insertUserInfo = (id, pw, bday, email, sex, verify) => doQuery(
    `INSERT INTO users
    (u_id, u_pw, u_bday, email, sex, verify)
    VALUES
    (?, ?, ?, ?, ?, ?)`,
    [id, pw, bday, email, sex, verify]
);
