/*
 * Copyright (c) 2020. Created by Seung Joo Noh.
 * All rights reserved.
 */

const mysql = require('mysql');
const b = require('../lotto');
const pool = mysql.createPool(b.poolConfig);

exports.doQuery = (query, args) => {
    return new Promise(function(resolve, reject){
        pool.getConnection(function(err, connection) {
            if(err){ reject(err); }
            else connection.query(query, args, function(err, rows) {
                if(err){ reject(err); }
                else resolve(rows);
                connection.release();
            });
        })
    });
};

