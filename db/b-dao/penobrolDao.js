const mysql = require('mysql');
const b = require('../../b.js');
const pool = mysql.createPool(b.poolConfig);
const dbcon = require('../dbconnection');

exports.slctPnbrl = (id, pw) => dbcon.doQuery(
    pool,
    `SELECT id, verify
    FROM users
    WHERE u_id = ? AND u_pw = ?`,
    [id, pw]
)
