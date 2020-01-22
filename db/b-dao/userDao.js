const mysql = require('mysql');
const b = require('../../b.js');
const pool = mysql.createPool(b.poolConfig);
const dbcon = require('../dbconnection');

exports.matchCredential = (id, pw) => dbcon.doQuery(
    pool,
    `SELECT id, verify
    FROM users
    WHERE u_id = ? AND u_pw = ?`,
    [id, pw]
)

exports. updLoginDate = (id) => dbcon.doQuery(
    pool,
    `UPDATE users
    SET last_login = NOW()
    WHERE u_id = ?`,
    id
)

exports.slctUserInfo = (id) => dbcon.doQuery(
    pool,
    `select u_id, date_format(u_bday,'%Y-%m-%d')as u_bday, sex, email
    from users
    where id = ?`,
    id
)

exports.updUserInfo = (id, pw, bday, gender) => dbcon.doQuery(
    pool,
    `update users
    set u_pw = ?,
    u_bday = ?,
    sex = ?
    where id = ?`,
    [pw, bday, gender, id]
)

exports.updateUserPw = (id, pw) => dbcon.doQuery(
    pool,
    `update users
    set u_pw = ?
    where u_id = ?`,
    [pw, id]
)

exports.insUserInfo = (id, pw, bday, email, sex, verify) => dbcon.doQuery(
    pool,
    `INSERT INTO users
    (u_id, u_pw, u_bday, email, sex, verify)
    VALUES
    (?, ?, ?, ?, ?, ?)`,
    [id, pw, bday, email, sex, verify]
)

exports.verifyUser = (email) => dbcon.doQuery(
    pool,
    `UPDATE users
    set verify = 1, verify_date = NOW()
    where email = ?`,
    email
)

exports.slctUserEmail = (email) => dbcon.doQuery(
    pool,
    `SELECT COUNT(email) AS total
    from users
    WHERE email = ?`,
    email
)

exports.sel = {
    matchCredential: (id, pw) => dbcon.doQuery(
        pool,
        `SELECT id, verify
        FROM users
        WHERE u_id = ? AND u_pw = ?`,
        [id, pw]
    ),
};

exports.upd = {
    matchCredential: (id, pw) => dbcon.doQuery(
        pool,
        `SELECT id, verify
        FROM users
        WHERE u_id = ? AND u_pw = ?`,
        [id, pw]
    ),
};

exports.ins = {
    matchCredential: (id, pw) => dbcon.doQuery(
        pool,
        `SELECT id, verify
        FROM users
        WHERE u_id = ? AND u_pw = ?`,
        [id, pw]
    ),
};

exports.del = {
    matchCredential: (id, pw) => dbcon.doQuery(
        pool,
        `SELECT id, verify
        FROM users
        WHERE u_id = ? AND u_pw = ?`,
        [id, pw]
    ),
};
