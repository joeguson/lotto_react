var conn = require('../b');
var pool = require('../b');

exports.select = function(query){
  return new Promise(function(resolve, reject){
    conn.conn.query(query, function(err, result, fields){
      if(!err){
        resolve(result);
      }
    });
  });
}

exports.selectWhere = function(query, id){
  return new Promise(function(resolve, reject){
    conn.conn.query(query, id, function(err, result, fields){
      if(!err){
        resolve(result);
      }
    });
  });
}
