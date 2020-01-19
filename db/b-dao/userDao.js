const mysql = require('mysql');
// const poolConfig = require('../../b');
var db_config =require('../../config.json');
const poolConfig = {
    host     : db_config.host,
    user     : db_config.user,
    password : db_config.password,
    database : db_config.database
};
const pool = mysql.createPool(poolConfig);
const dbcon = require('../dbconnection');

exports.userDao = {
    matchCredential: (id, pw) => dbcon.doQuery(
        pool,
        `SELECT id, verify FROM users WHERE u_id = ? AND u_pw = ?`,
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
