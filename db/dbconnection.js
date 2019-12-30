var conn = require('../b');
var pool = require('../b');

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
}

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
}

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
}

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
}
