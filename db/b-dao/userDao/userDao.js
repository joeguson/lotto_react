const daoUtil = require('../../daoUtil');

////////////////Select////////////////
exports.matchCredential = (id, pw) => daoUtil.doQuery(
  `SELECT id, verify
  FROM users
  WHERE u_id=? AND u_pw= ?`,
  [id, pw]
);
exports.userInfoByEmail = (email) => daoUtil.doQuery(
    `SELECT id, u_id, verify
    FROM users
    WHERE email = ?`,
    email
);
exports.userInfoById = (id) => daoUtil.doQuery(
    `select u_id, date_format(u_bday,'%Y-%m-%d')as u_bday, sex, email
    from users
    where id = ?`,
    id
);
exports.userCountById = (id) => daoUtil.doQuery(
    `SELECT COUNT(u_id)
    AS total
    from users
    WHERE u_id = ?`,
    id
);
exports.userCountByEmail = (email) => daoUtil.doQuery(
    `SELECT COUNT(email)
    AS total
    from users
    WHERE email = ?`,
    email
);
exports.userBasicInfoById = (id) => daoUtil.doQuery(
    `select u_id, date_format(u_bday,'%Y-%m-%d') as u_bday, sex, email
    from users
    where u_id = ?`,
    id
);
exports.userBasicInfoByEmail = (email) => daoUtil.doQuery(
    `select u_id, date_format(u_bday,'%Y-%m-%d') as u_bday, sex, email
    from users
    where email = ?`,
    email
);
exports.userSearch = (string) => daoUtil.doQuery(
    `SELECT u_id
    FROM users
    AS result
    WHERE MATCH(u_id)
    AGAINST(?)`,
    [string]
);

exports.getUserId2 = (userId) => daoUtil.doQuery(
    `SELECT id
    FROM users
    WHERE u_id = ?`,
    [userId]
);

////////////////Update////////////////
exports.updateLoginDate = (id) => daoUtil.doQuery(
    `UPDATE users
    SET last_login = NOW()
    WHERE u_id = ?`,
    id
);
exports.updateUserInfo = (pw, id) => daoUtil.doQuery(
    `update users
    set u_pw = ?
    where id = ?`,
    [pw, id]
);
exports.updateUserPw = (pw, id) => daoUtil.doQuery(
    `update users
    set u_pw = ?
    where u_id = ?`,
    [pw, id]
);
exports.verifyUser = (email) => daoUtil.doQuery(
    `UPDATE users
    set verify = 1, verify_date = NOW()
    where email = ?`,
    email
);
////////////////Insert////////////////
exports.insertUserInfo = (id, pw, bday, sex, email, verify) => daoUtil.doQuery(
    `INSERT INTO users
    (u_id, u_pw, u_bday, sex, email, verify)
    VALUES
    (?, ?, ?, ?, ?, ?)`,
    [id, pw, bday, sex, email, verify]
);
