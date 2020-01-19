const mysql2 = require('mysql');
const db_config = require('../../config.json');
const pool = mysql2.createPool(
    {
        host     : db_config.host,
        user     : db_config.user,
        password : db_config.password,
        database : db_config.database
    }
);

exports.userDao = {
    credentialMatch: (id, pw) => {
        var sql1 = 'SELECT id, verify FROM users WHERE u_id = ? AND u_pw = ?';
        var sql2 = 'UPDATE users SET last_login = NOW() WHERE u_id = ?';
        return new Promise(function(resolve, reject){
            pool.getConnection(function(err, connection) {
                // Use the connection
                connection.query(sql1, [id, pw], function(err, rows) {
                    if(err){console.log(err);}
                    else{
                        resolve(rows);
                    }
                    // And done with the connection
                    connection.release();
                    // Don't use the connection here, it has been returned to the pool.
                });
            })
        });
    }
};
