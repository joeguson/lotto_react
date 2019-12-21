var conn = require('../../b');
var pool = require('../../b');
var dbcon = require('../../db/dbconnection');

exports.getCari = function(req, res){
//    var todayDate = new Date();
//    var todayDay = todayDate.getDate();
//    if(parseInt(req.cookies.visitDate) !== todayDay){
//        todayCount++;
//    }
//    res.cookie('visitDate', todayDay, {maxAge: 86400000, httpOnly: true });
//    var ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;

//    var sql3 = '';
//    var sql4 = '';
  var getRandomPenobrol = 'select * from penobrol';
  var getRandomTandya = 'select * from tandya';
  var getHashtagP = 'select * from penobrol_hashtag where p_id = ?';
  var getHashtagT = 'select * from tandya_hashtag where t_id = ?';
  var pResults = [];
  var tResults = [];
  var phashResults = [];
  var thashResults = [];

  async function getRandomPandT(){
    pResults = await dbcon.oneArg(getRandomPenobrol);
    tResults = await dbcon.oneArg(getRandomTandya);
    for(var i=0;i<pResults.length;i++){
      phashResults.push(await dbcon.twoArg(getHashtagP, pResults[i].id));
    }
    for(var j=0;j<tResults.length;j++){
      thashResults.push(await dbcon.twoArg(getHashtagT, tResults[j].id, ));
    }
    if(req.session.u_id){
        res.render('./jc/cari', {prandoms:pResults, phashtags:phashResults, trandoms:tResults, thashtags:thashResults, u_id:'req.session.u_id'});
    }
    else{
        res.render('./jc/cari', {prandoms:pResults, phashtags:phashResults, trandoms:tResults, thashtags:thashResults});
    }
  }
  getRandomPandT();
};

exports.getSearch = function(req, res){
    var cari = req.query.search;
    var hsresult = [];
    var hsforpt = [];
    var cari_check = searchStringLengthChecker(cari);
    var hashtagonly = [];
    var hashtagonly2 = '';
    var stringonly = [];
    var stringonly2 = '';
    var penobrolsql = 'SELECT * FROM penobrol AS result WHERE MATCH(title, content) AGAINST(?)';
    var tandyasql = 'SELECT * FROM tandya AS result WHERE MATCH(question, content) AGAINST(?)';
    var usersql = 'select * from users AS result WHERE MATCH(u_id) AGAINST(?)';
    var hashtagsql = '';
    var phtsql = '';
    var thtsql = '';
    for(var q = 0; q<cari_check.length;q++){
        if(cari_check[q].indexOf('#') != -1){
            hashtagonly.push(cari_check[q].substring(1));
            hashtagonly2 = hashtagonly2 + cari_check[q].substring(1) + ' ';
        }
        else{
            stringonly.push(cari_check[q]);
            stringonly2 = stringonly2 + cari_check[q]+' ';
        }
    }
    hashtagonly2 = hashtagonly2.trim();
    stringonly2 = stringonly2.trim();
    var newpsql = '';
    var newtsql = '';
    conn.query(penobrolsql, stringonly2, function(err, penobrols, f){
        if(err){console.log(err);}
        else{
            conn.query(tandyasql, stringonly2, function(err, tandyas, f){
                if(err){console.log(err);}
                else{
                    conn.query(usersql, stringonly2, function(err, users, f){
                        if(err){console.log(err);}
                        else{
                            if(hashtagonly.length < 1){
                                hashtagsql = hsSearchSqlMaker(stringonly);
                            }
                            else{
                                hashtagsql = hsSearchSqlMaker(hashtagonly);
                            }
                            phtsql = phtsqlMaker(penobrols);
                            thtsql = thtsqlMaker(tandyas);
                            conn.query(hashtagsql, function(err, hashtags, f){
                                if(err){console.log(err);}
                                else{
                                    var ps = [];
                                    var ts = [];
                                    //p, t both have values.
                                    if(penobrols.length >= 1 && tandyas.length>=1){
                                        conn.query(phtsql, function(err, phtresult, f){
                                            if(err){console.log(err);}
                                            else{
                                                conn.query(thtsql, function(err, thtresult, f){
                                                    if(err){console.log(err);}
                                                    else{
                                                        var tmp1 = phtresult.length -1;
                                                        while(tmp1 >= 0){
                                                            hsforpt.unshift(JSON.parse(JSON.stringify(phtresult[tmp1])));
                                                            tmp1 --;
                                                        }
                                                        var tmp2 = thtresult.length -1;
                                                        while(tmp2 >= 0){
                                                            hsforpt.unshift(JSON.parse(JSON.stringify(thtresult[tmp2])));
                                                            tmp2 --;
                                                        }
                                                        //when hashtag is shorter than 1
                                                        if(hashtags.length<1){
                                                            res.render('./jc/cari-result', {penobrols:penobrols, tandyas:tandyas, users:users, hashtags:hsresult, pthash:hsforpt, cari:cari});
                                                        }
                                                        //when hashtag is longer than 1
                                                        else{
                                                            var tmp3 = hashtags.length -1;
                                                            while(tmp3 >= 0){
                                                                hsforpt.unshift(JSON.parse(JSON.stringify(hashtags[tmp3])));
                                                                tmp3 --;
                                                            }
                                                            for(var i =0; i<hashtags.length; i++){
                                                                if(hashtags[i].t_id === 0){
                                                                    ps.unshift(hashtags[i].p_id);
                                                                }
                                                                else{
                                                                    ts.unshift(hashtags[i].t_id);
                                                                }
                                                            }
                                                            newpsql = psqlMaker(ps);
                                                            newtsql = tsqlMaker(ts);
                                                            //when both are longer than 1
                                                            if(ps.length>=1 && ts.length >=1){
                                                                conn.query(newpsql, function(err, pResult, f){
                                                                    conn.query(newtsql, function(err, tResult, f){
                                                                        var temp1 = pResult.length -1;
                                                                        while(temp1 >= 0){
                                                                            hsresult.unshift(JSON.parse(JSON.stringify(pResult[temp1])));
                                                                            temp1 --;
                                                                        }
                                                                        var temp2 = tResult.length -1;
                                                                        while(temp2 >= 0){
                                                                            hsresult.unshift(JSON.parse(JSON.stringify(tResult[temp2])));
                                                                            temp2 --;
                                                                        }
                                                                        hsforpt = remove_duplicates(hsforpt);
                                                                        res.render('./jc/cari-result', {penobrols:penobrols, tandyas:tandyas, users:users, hashtags:hsresult, pthash:hsforpt, cari:cari});
                                                                    });
                                                                });
                                                            }
                                                            //when only t is longer than 1
                                                            else if(ps.length<1){
                                                                conn.query(newtsql, function(err, tResult, f){
                                                                    var temp2 = tResult.length -1;
                                                                    while(temp2 >= 0){
                                                                        hsresult.unshift(JSON.parse(JSON.stringify(tResult[temp2])));
                                                                        temp2 --;
                                                                    }
                                                                    hsforpt = remove_duplicates(hsforpt);
                                                                    res.render('./jc/cari-result', {penobrols:penobrols, tandyas:tandyas, users:users, hashtags:tResult, pthash:hsforpt, cari:cari});
                                                                });
                                                            }
                                                            //when only p is longer than 1
                                                            else{
                                                                conn.query(newpsql, function(err, pResult, f){
                                                                    var temp1 = pResult.length -1;
                                                                    while(temp1 >= 0){
                                                                        hsresult.unshift(JSON.parse(JSON.stringify(pResult[temp1])));
                                                                        temp1 --;
                                                                    }
                                                                    hsforpt = remove_duplicates(hsforpt);
                                                                    res.render('./jc/cari-result', {penobrols:penobrols, tandyas:tandyas, users:users, hashtags:pResult, pthash:hsforpt, cari:cari});
                                                                });
                                                            }

                                                        }
                                                    }

                                                });
                                            }
                                        });
                                    }
                                    else if(penobrols.length<1){
                                        conn.query(thtsql, function(err, thtresult, f){
                                            if(err){console.log(err);}
                                            else{
                                                var tmp4 = thtresult.length -1;
                                                while(tmp4 >= 0){
                                                    hsforpt.unshift(JSON.parse(JSON.stringify(thtresult[tmp4])));
                                                    tmp4 --;
                                                }
                                                //when hashtag is shorter than 1
                                                if(hashtags.length<1){ //when hashtag is shorter than 1
                                                    hsforpt = remove_duplicates(hsforpt);
                                                    res.render('./jc/cari-result', {penobrols:penobrols, tandyas:tandyas, users:users, hashtags:hsresult, pthash:hsforpt, cari:cari});
                                                }
                                                else{ //when hashtag is longer than 1
                                                    var tmp5 = hashtags.length -1;
                                                    while(tmp5 >= 0){
                                                        hsforpt.unshift(JSON.parse(JSON.stringify(hashtags[tmp5])));
                                                        tmp5 --;
                                                    }
                                                    for(var i =0; i<hashtags.length; i++){
                                                        if(hashtags[i].t_id === 0){
                                                            ps.unshift(hashtags[i].p_id);
                                                        }
                                                        else{
                                                            ts.unshift(hashtags[i].t_id);
                                                        }
                                                    }
                                                    newpsql = psqlMaker(ps);
                                                    newtsql = tsqlMaker(ts);
                                                    //when both are longer than 1
                                                    if(ps.length>=1 && ts.length >=1){
                                                        conn.query(newpsql, function(err, pResult, f){
                                                            conn.query(newtsql, function(err, tResult, f){
                                                                var temp1 = pResult.length -1;
                                                                while(temp1 >= 0){
                                                                    hsresult.unshift(JSON.parse(JSON.stringify(pResult[temp1])));
                                                                    temp1 --;
                                                                }
                                                                var temp2 = tResult.length -1;
                                                                while(temp2 >= 0){
                                                                    hsresult.unshift(JSON.parse(JSON.stringify(tResult[temp2])));
                                                                    temp2 --;
                                                                }
                                                                hsforpt = remove_duplicates(hsforpt);
                                                                res.render('./jc/cari-result', {penobrols:penobrols, tandyas:tandyas, users:users, hashtags:hsresult, pthash:hsforpt, cari:cari});
                                                            });
                                                        });
                                                    }
                                                    else if(ps.length<1){
                                                        conn.query(newtsql, function(err, tResult, f){
                                                            var temp2 = tResult.length -1;
                                                            while(temp2 >= 0){
                                                                hsresult.unshift(JSON.parse(JSON.stringify(tResult[temp2])));
                                                                temp2 --;
                                                            }
                                                            hsforpt = remove_duplicates(hsforpt);
                                                            res.render('./jc/cari-result', {penobrols:penobrols, tandyas:tandyas, users:users, hashtags:tResult, pthash:hsforpt, cari:cari});
                                                        });
                                                    }
                                                    else{
                                                        conn.query(newpsql, function(err, pResult, f){
                                                            var temp1 = pResult.length -1;
                                                            while(temp1 >= 0){
                                                                hsresult.unshift(JSON.parse(JSON.stringify(pResult[temp1])));
                                                                temp1 --;
                                                            }
                                                            hsforpt = remove_duplicates(hsforpt);
                                                            res.render('./jc/cari-result', {penobrols:penobrols, tandyas:tandyas, users:users, hashtags:pResult, pthash:hsforpt, cari:cari});
                                                        });
                                                    }

                                                }
                                            }
                                        });
                                    }
                                    else{
                                        conn.query(phtsql, function(err, phtresult, f){
                                            if(err){console.log(err);}
                                            else{
                                                var tmp4 = phtresult.length -1;
                                                while(tmp4 >= 0){
                                                    hsforpt.unshift(JSON.parse(JSON.stringify(phtresult[tmp4])));
                                                    tmp4 --;
                                                }
                                            }
                                            if(hashtags.length<1){ //when hashtag is shorter than 1
                                                hsforpt = remove_duplicates(hsforpt);
                                                res.render('./jc/cari-result', {penobrols:penobrols, tandyas:tandyas, users:users, hashtags:hsresult, pthash:hsforpt, cari:cari});
                                            }
                                            else{ //when hashtag is longer than 1
                                                var tmp6 = hashtags.length -1;
                                                while(tmp6 >= 0){
                                                    hsforpt.unshift(JSON.parse(JSON.stringify(hashtags[tmp6])));
                                                    tmp6 --;
                                                }
                                                for(var i =0; i<hashtags.length; i++){
                                                    if(hashtags[i].t_id === 0){
                                                        ps.unshift(hashtags[i].p_id);
                                                    }
                                                    else{
                                                        ts.unshift(hashtags[i].t_id);
                                                    }
                                                }
                                                newpsql = psqlMaker(ps);
                                                newtsql = tsqlMaker(ts);
                                                if(ps.length>=1 && ts.length >=1){
                                                    conn.query(newpsql, function(err, pResult, f){
                                                        conn.query(newtsql, function(err, tResult, f){
                                                            var temp1 = pResult.length -1;
                                                            while(temp1 >= 0){
                                                                hsresult.unshift(JSON.parse(JSON.stringify(pResult[temp1])));
                                                                temp1 --;
                                                            }
                                                            var temp2 = tResult.length -1;
                                                            while(temp2 >= 0){
                                                                hsresult.unshift(JSON.parse(JSON.stringify(tResult[temp2])));
                                                                temp2 --;
                                                            }
                                                            hsforpt = remove_duplicates(hsforpt);
                                                            res.render('./jc/cari-result', {penobrols:penobrols, tandyas:tandyas, users:users, hashtags:hsresult, pthash:hsforpt, cari:cari});
                                                        });
                                                    });
                                                }
                                                else if(ps.length<1){
                                                    conn.query(newtsql, function(err, tResult, f){
                                                        var temp2 = tResult.length -1;
                                                        while(temp2 >= 0){
                                                            hsresult.unshift(JSON.parse(JSON.stringify(tResult[temp2])));
                                                            temp2 --;
                                                        }
                                                        hsforpt = remove_duplicates(hsforpt);
                                                        res.render('./jc/cari-result', {penobrols:penobrols, tandyas:tandyas, users:users, hashtags:tResult, pthash:hsforpt, cari:cari});
                                                    });
                                                }
                                                else{
                                                    conn.query(newpsql, function(err, pResult, f){
                                                        var temp1 = pResult.length -1;
                                                        while(temp1 >= 0){
                                                            hsresult.unshift(JSON.parse(JSON.stringify(pResult[temp1])));
                                                            temp1 --;
                                                        }
                                                        hsforpt = remove_duplicates(hsforpt);
                                                        res.render('./jc/cari-result', {penobrols:penobrols, tandyas:tandyas, users:users, hashtags:pResult, pthash:hsforpt, cari:cari});
                                                    });
                                                }
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    });
                }
            });
        }
    });
    var searchStringSql = '';
    var ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    if(req.session.u_id){
        searchStringSql = 'INSERT INTO search_string (u_id, search_string, ipAddress) VALUES (?, ?, INET_ATON(?))';
        conn.query(searchStringSql,[req.session.u_id, cari, ipAddress], function(err, searchStringResult, field){
            if(err){console.log(err);}
        });
    }
    else{
        searchStringSql = 'INSERT INTO search_string (search_string, ipAddress) VALUES (?, INET_ATON(?))';
        conn.query(searchStringSql, [cari, ipAddress], function(err, searchStringResult, field){
            if(err){console.log(err);}
        });
    }
};

exports.getLoad = function(req, res){
    var sql = 'SELECT * FROM penobrol order by rand() limit 3';
    var sql2 = 'SELECT * FROM tandya order by rand() limit 3';
    var sql3 = '';
    var sql4 = '';
    conn.query(sql, function(err, penobrol, fields){
        conn.query(sql2, function(err, tandya, fields){
            if(err){console.log(err);}
            else{
                sql3 = phtsqlMaker(penobrol);
                sql4 = thtsqlMaker(tandya);
                conn.query(sql3, function(err, phashtag, fields){
                    if(err){console.log(err);}
                    else{
                        conn.query(sql4, function(err, thashtag, fields){
                            if(err){console.log(err);}
                            else{
                                var p = JSON.parse(JSON.stringify(penobrol));
                                var t = JSON.parse(JSON.stringify(tandya));
                                var phash = JSON.parse(JSON.stringify(phashtag));
                                var thash = JSON.parse(JSON.stringify(thashtag));
                                p = p.concat(t);
                                phash = phash.concat(thash);
                                var responseData = {'result' : 'ok', 'data': p, 'hashtag':phash};
                                res.json(responseData);
                            }
                        });
                    }
                });
            }
        });
    });
};
