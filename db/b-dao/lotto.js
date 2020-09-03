const daoUtil = require('../daoUtil');

/* === select === */

exports.selectHistoryById = (id) => daoUtil.doQuery(
    `SELECT fir, sec, thi, fou, fif, six 
    FROM lotto_all 
    WHERE id = (SELECT comb_id FROM lotto_history WHERE id = ?)`,
    id
);

exports.selectCombById = (combId) => daoUtil.doQuery(
    `SELECT fir, sec, thi, fou, fif, six 
    FROM lotto_all 
    WHERE id = ?`,
    combId
);

/* === insert === */

exports.insertCombination = (arr) => daoUtil.doQuery(
    `INSERT INTO lotto_all (fir, sec, thi, fou, fif, six)
    VALUES ?`,
    [arr]
);

exports.insertHistory = (strDate, fir, sec, thi, fou, fif, six) => daoUtil.doQuery(
    `insert into lotto_history(date, comb_id) 
    values(?, 
    (select id from lotto_all 
    where fir = ? AND sec = ? AND thi = ? AND fou = ? AND fif = ? AND six = ?)
    )`,
    [strDate, fir, sec, thi, fou, fif, six]
);

