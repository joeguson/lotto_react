const daoUtil = require('../daoUtil');

////////////////Select////////////////
exports.countUsers = () => daoUtil.doQuery(
  `select count(*)
  AS users from users`
);
exports.countPenobrol = () => daoUtil.doQuery(
  `select count(*)
  AS penobrol from penobrol`
);
exports.countTandya = () => daoUtil.doQuery(
  `select count(*)
  AS tandya from tandya`
);
exports.countYoutublog = () => daoUtil.doQuery(
    `select count(*)
  AS youtublog from youtublog`
);
exports.countComments = () => daoUtil.doQuery(
  `select count(*)
  AS pcom from p_com`
);
exports.countAnswers = () => daoUtil.doQuery(
  `select count(*)
  AS tans from t_ans`
);
exports.tWeekly = (date1, date2) => daoUtil.doQuery(
  `select *
  from tandya
  where date
  between date(?) and date (?)
  order by score
  desc limit 2`,
  [date1, date2]
);
exports.pWeekly = (date1, date2) => daoUtil.doQuery(
  `select *
  from penobrol
  where date
  between date(?) and date (?)
  order by score
  desc limit 2`,
  [date1, date2]
);
////////////////Update////////////////
exports.updateLoginDate = (id) => daoUtil.doQuery(
    `UPDATE users
    SET last_login = NOW()
    WHERE u_id = ?`,
    id
);

////////////////Insert////////////////
exports.weeklyInsert = (array) => daoUtil.doQuery(
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
exports.dailyInsert = (int) => daoUtil.doQuery(
    `INSERT INTO daily_count
    (visitCount)
    VALUES (?)`,
    int
);
