const mysql2 = require('mysql');
var dbcon = require('../dbconnection');
const poolConfig = require('../../b');
const pool = mysql2.createPool(poolConfig);

exports.userDao = {
    matchCredential: (id, pw) => dbcon.doQuery(
        pool,
        `SELECT id, verify
        FROM users
        WHERE u_id = ? AND u_pw = ?`,
        [id, pw]
    ),
    updateLoginDate: (id) => dbcon.doQuery(
        pool,
        `UPDATE users SET last_login = NOW() WHERE u_id = ?`,
        id
    ),
    getUserInfo: (id) => dbcon.doQuery(
        pool,
        `select u_id, date_format(u_bday,'%Y-%m-%d')as u_bday, sex, email
        from users
        where id = ?`,
        id
    )
};
