exports.doQuery = function(pool, sql, arg) {
    return new Promise(function(resolve, reject){
        pool.getConnection(function(err, connection) {
            if(err){ reject(err); }
            connection.query(sql, arg, function(err, rows) {
                if(err){ reject(err); }
                else resolve(rows);
                connection.release();
            });
        })
    });
};
