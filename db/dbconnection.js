const conn = require('../b');

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


exports.oneArg = function(query){
    return new Promise(function(resolve, reject){
        conn.conn.query(query, function(err, result, fields){
            if(!err){
                resolve(result);
            }
            else{
                console.log(err);
            }
        });
    });
};

exports.twoArg = function(query, id){
    return new Promise(function(resolve, reject){
        conn.conn.query(query, id, function(err, result, fields){
            if(!err){
                resolve(result);
            }
            else{
                console.log(err);
            }
        });
    });
};

exports.threeArg = function(query, id, arg1){
    return new Promise(function(resolve, reject){
        conn.conn.query(query, [id, arg1], function(err, result, fields){
            if(!err){
                resolve(result);
            }
            else{
                console.log(err);
            }
        });
    });
};

exports.fourArg = function(query, id, arg1, arg2){
    return new Promise(function(resolve, reject){
        conn.conn.query(query, [id, arg1, arg2], function(err, result, fields){
            if(!err){
                resolve(result);
            }
            else{
                console.log(err);
            }
        });
    });
};
// var conn = require('../b');
// var pool = require('../b');
//
// exports.oneArg = function(query){
//     return new Promise(function(resolve, reject){
//         conn.conn.query(query, callbackClosure(resolve, reject));
//     });
// }
//
// exports.twoArg = function(query, id){
//     return new Promise(function(resolve, reject){
//         conn.conn.query(query, id, callbackClosure(resolve, reject));
//     });
// }
//
// exports.threeArg = function(query, id, arg1){
//     return new Promise(function(resolve, reject){
//         conn.conn.query(query, [id, arg1], callbackClosure(resolve, reject));
//     });
// }
//
// exports.fourArg = function(query, id, arg1, arg2){
//     return new Promise(function(resolve, reject){
//         conn.conn.query(query, [id, arg1, arg2], callbackClosure(resolve, reject));
//     });
// }

// exports.doQuery = function(query, arg1=null, arg2=null, arg3=null) {
//    return new Promise(function(resolve, reject) {
//       if(arg1 == null) conn.conn.query(query, callbackClosure(resolve, reject));
//       else if(arg2 == null) conn.conn.query(query, arg1, callbackClosure(resolve, reject));
//       else if(arg3 == null) conn.conn.query(query, [arg1, arg2], callbackClosure(resolve, reject));
//       else conn.conn.query(query, [arg1, arg2, arg3], callbackClosure(resolve, reject));
//    });
// }
//
// function callbackClosure(resolve, reject) {
//    return function(err, rsult, fields) {
//             if(!err){
//                 resolve(result);
//             }
//             else{
//                 console.log(err);
//             }
//    };
// }
//
// doQuery(query);
// doQuery(query, arg1);
