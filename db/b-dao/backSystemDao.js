const mysql = require('mysql');
const b = require('../../b.js');
const pool = mysql.createPool(b.poolConfig);
const dbcon = require('../dbconnection');

function doQuery(query, args) {
  return dbcon.doQuery(pool, query, args);
}

////////////////Select////////////////
exports.countUsers = () => doQuery(
  `select count(*)
  AS users from users`
);
exports.countPenobrol = () => doQuery(
  `select count(*)
  AS penobrol from penobrol`
);
exports.countTandya = () => doQuery(
  `select count(*)
  AS tandya from tandya`
);
exports.countComments = () => doQuery(
  `select count(*)
  AS pcom from p_com`
);
exports.countAnswers = () => doQuery(
  `select count(*)
  AS tans from t_ans`
);
exports.tWeekly = (date1, date2) => doQuery(
  `select *
  from tandya
  where date
  between date(?) and date (?)
  order by score
  desc limit 2`,
  [date1, date2]
);
exports.pWeekly = (date1, date2) => doQuery(
  `select *
  from penobrol
  where date
  between date(?) and date (?)
  order by score
  desc limit 2`,
  [date1, date2]
);
////////////////Update////////////////
exports.updateLoginDate = (id) => doQuery(
    `UPDATE users
    SET last_login = NOW()
    WHERE u_id = ?`,
    id
);

////////////////Insert////////////////
exports.weeklyInsert = (array) => doQuery(
    `INSERT INTO weekly (
        gold_p,
        silver_p,
        bronze_p,
        gold_t,
        silver_t,
        bronze_t
    )
    VALUES(?)`,
    array
);
exports.dailyInsert = (int) => doQuery(
    `INSERT INTO daily_count
    (visitCount)
    VALUES (?)`,
    int
);
