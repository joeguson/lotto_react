/*
 * Copyright (c) 2020. Created by Hyun I Kim.
 * All rights reserved.
 */

const mysql = require('mysql');
const b = require('../../../b.js');
const pool = mysql.createPool(b.poolConfig);
const dbcon = require('../../dbconnection');

function doQuery(query, args) {
    return dbcon.doQuery(pool, query, args);
}

const youtubeSourceTable = "youtube_source";
const youtubeTimeRowTable = "youtube_time_row";

/* ===== CREATE ===== */
/**
 * Creates new youtube source with null article id.
 * @param source youtube link to embed
 * @returns {Promise}
 */
exports.insertYoutubeSource = (source) => new Promise((res, rej) => {
    pool.getConnection(function(err, con) {
        if (err) rej(err);

        con.query(`INSERT INTO ${youtubeSourceTable}(source) VALUES (?);`, source, (err) => {
            if (err) rej(err);

            con.query(`SELECT LAST_INSERT_ID() as id;`, null, (err, rows) => {
                if (err) rej(err);
                res(rows);
            });
        });
    });
});

/**
 * Creates new youtube time row of inserted youtube source.
 * @param sourceId id of inserted youtube source
 * @param time string representation of time. hh:MM:ss
 * @param desc string description of time row
 * @returns {Promise}
 */
exports.insertYoutubeTimeRow = (sourceId, time, desc) => doQuery(
    `INSERT INTO ${youtubeTimeRowTable} VALUES (?, ?, ?)`,
    [sourceId, time, desc]
);

/**
 * Creates new youtube time rows of inserted youtube source.
 * @param sourceId id of inserted youtube source
 * @param rows list of time row data (time, desc)
 * @returns {Promise}
 */
exports.insertYoutubeTimeRows = async (sourceId, rows) => {
    const query = `INSERT INTO ${youtubeTimeRowTable} VALUES ` + rows.map(() => '(?, ?, ?)').join(', ') + ';';
    await doQuery(query, rows.map(d => [sourceId, d.time, d.desc]).flat());
};

/* ===== READ ===== */
/**
 * Selects single youtube source with given id.
 * @param id id of youtube source
 * @returns {Promise}
 */
exports.selectYoutubeSource = (id) => doQuery(
    `SELECT * FROM ${youtubeSourceTable} WHERE id=?`,
    id
);
/**
 * Selects all youtube time rows associated with given youtube source id.
 * @param sourceId youtube source id to find
 * @returns {Promise}
 */
exports.selectYoutubeTimeRows = (sourceId) => doQuery(
    `SELECT * FROM ${youtubeTimeRowTable} WHERE youtube_source_id=?`,
    sourceId
);

/* ===== UPDATE ===== */
/**
 * Updates article id of given youtube source. Used to confirm article post.
 * @param id id of youtube source
 * @param articleId id of posted article
 * @returns {Promise}
 */
exports.updateYoutubeSourceArticleId = (id, articleId) => doQuery(
    `UPDATE ${youtubeSourceTable} SET article_id=? WHERE id=?`,
    [articleId, id]
);
/**
 * Updates article id of given youtube source. Used to confirm article post.
 * @param ids id list of youtube source
 * @param articleId id of posted article
 * @returns {Promise}
 */
exports.updateYoutubeSourceArticleIds = (ids, articleId) => doQuery(
    `UPDATE ${youtubeSourceTable} SET article_id=? WHERE id IN (?)`,
    [articleId, ids]
);
/* ===== DELETE ===== */
/**
 * Deletes youtube source with given id and associated youtube time rows.
 * @param id id of youtube source
 * @returns {Promise}
 */
exports.deleteYoutubeWithId = (id) => doQuery(
    `DELETE FROM ${youtubeSourceTable} WHERE id=?`,
    id
);
// TODO delete all youtube sources with null article id and created time has passed over specific amount of time.