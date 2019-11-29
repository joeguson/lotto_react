//testing for this
var express = require('express');
var nodemailer = require('nodemailer');
var router = express.Router();
var cookieParser = require('cookie-parser');
exports.router = router;
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var mysql = require('mysql');
var path = require('path')
var favicon = require('serve-favicon');
var schedule = require('node-schedule');
var db_config =require('./config.json');
var fs = require('fs');
var useragent = require('express-useragent');
exports.sch = schedule;
app.use(useragent.express());
app.use(favicon(path.join(__dirname,'css', 'logo2.png')));
app.use(session({
    secret : 'hithere@#',
    resave: false,
    saveUninitialized: true,
    store: new MySQLStore({
        host     : db_config.host,
        user     : db_config.user,
        password : db_config.password,
        database : db_config.database
    })
}));
var conn = mysql.createConnection(
    {
      host     : db_config.host,
      user     : db_config.user,
      password : db_config.password,
      database : db_config.database
    }
);
conn.connect();
exports.conn = conn;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.locals.pretty = true;
app.use(express.static('css'));
app.use("/jade", express.static('/'));
app.set('view engine', 'jade');
app.set('views', './jade');
app.use(cookieParser());

var penobrol = require('./penobrol');
var tandya = require('./tandya');
var aku = require('./aku');
var cari = require('./cari');

var todayCount = 1;
/************chonggwalpage************/
app.get('/chonggwalpage', function(req, res){
    var overviewUsers = 'select count(*) AS users from users';
    var overviewPen = 'select count(*) AS penobrol from penobrol';
    var overviewTan = 'select count(*) AS tandya from tandya';
    var overviewPcom = 'select count(*) AS pcom from p_com';
    var overviewTans = 'select count(*) AS tans from t_ans';

    conn.query(overviewUsers, function(err, users, fields){
        if(err){console.log(err);}
        else{
            conn.query(overviewPen, function(err, pen, fields){
                if(err){console.log(err);}
                else{
                    conn.query(overviewTan, function(err, tan, fields){
                        if(err){console.log(err);}
                        else{
                            conn.query(overviewPcom, function(err, pcom, fields){
                                if(err){console.log(err);}
                                else{
                                    conn.query(overviewTans, function(err, tans, fields){
                                        if(err){console.log(err);}
                                        else{
                                            console.log(users[0]);
                                            res.render('chonggwalpage', {'users': users[0], 'pen': pen[0], 'tan': tan[0], 'pcom': pcom[0], 'tans': tans[0]});
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});
app.post('/chonggwalpage', function(req, res){
    var overviewUsers = 'select count(*) from users';
    var overviewPen = 'select count(*) from penobrol';
    var overviewTan = 'select count(*) from tandya';
    var overviewPcom = 'select count(*) from p_com';
    var overviewTans = 'select count(*) from t_ans';
    conn.query(overviewUsers, function(err, users, fields){
        if(err){console.log(err);}
        else{
            conn.query(overviewPen, function(err, pen, fields){
                if(err){console.log(err);}
                else{
                    conn.query(overviewTan, function(err, tan, fields){
                        if(err){console.log(err);}
                        else{
                            conn.query(overviewPcom, function(err, pcom, fields){
                                if(err){console.log(err);}
                                else{
                                    conn.query(overviewTans, function(err, tans, fields){
                                        if(err){console.log(err);}
                                        else{
                                            var responseData = {'result' : 'ok', 'users': users[0], 'pen': pen[0], 'tan': tan[0], 'pcom': pcom[0], 'tans': tans[0]};
                                            res.json(responseData);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

var psqlMaker = function(pId){
    var temp = 'select * from penobrol where ';
    for(var j = 0; j<pId.length; j++){
        temp = temp + 'id = '+pId[j] + ' OR ';
    }
    temp = temp.slice(0,-1);
    temp = temp.slice(0,-1);
    temp = temp.slice(0,-1);
    temp = temp.slice(0,-1);
    return temp;
};
var tsqlMaker = function(tId){
    var temp = 'select * from tandya where ';
    for(var k = 0; k<tId.length; k++){
        temp = temp + 'id = '+tId[k] + ' OR ';
    }
    temp = temp.slice(0,-1);
    temp = temp.slice(0,-1);
    temp = temp.slice(0,-1);
    temp = temp.slice(0,-1);
    return temp;
};

var searchStringLengthChecker = function(cari_string){
    var tempArray = cari_string.split(' ');
    var temp = [];
    for(var i=0; i<tempArray.length; i++){
        if(tempArray[i] !== ''){
            temp.push(tempArray[i]);
        }
    }
    return temp;
};

var phtsqlMaker = function(hastagObject){
    var holength = hastagObject.length;
    var hotemp = [];
    for(var i =0; i<holength;i++){
        hotemp.push(hastagObject[i].id);
    }
    var temp = 'select * from hashtag where ';
    for(var k = 0; k<hotemp.length; k++){
        temp = temp + 'p_id = '+hotemp[k] + ' OR ';
    }
    temp = temp.slice(0,-1);
    temp = temp.slice(0,-1);
    temp = temp.slice(0,-1);
    temp = temp.slice(0,-1);
    return temp;
};

var thtsqlMaker = function(hashtagObject){
    var holength = hashtagObject.length;
    var hotemp = [];
    for(var i =0; i<holength;i++){
        hotemp.push(hashtagObject[i].id);
    }
    var temp = 'select * from hashtag where ';
    for(var k = 0; k<hotemp.length; k++){
        temp = temp + 't_id = '+hotemp[k] + ' OR ';
    }
    temp = temp.slice(0,-1);
    temp = temp.slice(0,-1);
    temp = temp.slice(0,-1);
    temp = temp.slice(0,-1);
    return temp;
};

var doubleChecker = function(a, b){
    var temp1 = [];
    var temp2 = [];
    if(a.length >= b.length){
        temp1 = b;
        temp2 = a;
    }
    else{
        temp1 = a;
        temp2 = b;
    }
    for(var i =0; i<temp1.length;i++){
        for(var j = 0; j<temp2.length;j++){
            if(temp1[i].id == temp2[j].id){
                temp2.splice(j, 1);
            }
        }
    }
    temp1 = temp1.concat(temp2);
    return temp1;
};
var hsSearchSqlMaker = function(hashtags){
    var temp = 'select * from hashtag where ';
    for(var k = 0; k<hashtags.length; k++){
        temp = temp + 'concat(ht1, ht2, ht3, ht4, ht5, ht6, ht7) LIKE '+"'%"+hashtags[k]+"%'" + ' OR ';
    }
    temp = temp.slice(0,-1);
    temp = temp.slice(0,-1);
    temp = temp.slice(0,-1);
    temp = temp.slice(0,-1);
    return temp;
};

app.get('/cari/search', function(req, res){
    var cari = req.query.search;
    var hsresult = [];
    var hsforpt = [];
    var cari_check = searchStringLengthChecker(cari);
    var hashtagonly = [];
    var stringonly = [];
    var stringonly2 = '';
    var penobrolsql = 'SELECT * FROM penobrol AS result WHERE MATCH(title, content) AGAINST(?)';
    var tandyasql = 'SELECT * FROM tandya AS result WHERE MATCH(question, content) AGAINST(?)';
    var usersql = 'select * from users AS result WHERE MATCH(u_id) AGAINST(?)';
    var hashtagsql = 'select * from users AS result WHERE MATCH(u_id) AGAINST(?)';
    var phtsql = '';
    var thtsql = '';
    for(var q = 0; q<cari_check.length;q++){
        if(cari_check[q].indexOf('#') != -1){
            hashtagonly.push(cari_check[q]);
        }
        else{
            stringonly.push(cari_check[q]);
            stringonly2 = stringonly2 + cari_check[q]+' ';
        }
    }
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
                                if(hashtagonly.length>0){
                                    for(var r = 0;r<hashtagonly.length; r++){
                                        hashtagonly[r] = hashtagonly[r].substring(1);
                                    }
                                }
                                hashtagsql = hsSearchSqlMaker(hashtagonly);
                            }
                            phtsql = phtsqlMaker(penobrols);
                            thtsql = thtsqlMaker(tandyas);
                            conn.query(hashtagsql, function(err, hashtags, f){
                                if(err){console.log(err);}
                                else{
                                    var ps = [];
                                    var ts = [];
                                    //p, t both have values
                                    if(penobrols.length >= 1 && tandyas.length>=1){
                                        conn.query(phtsql, function(err, phtresult, f){
                                            if(err){console.log(err);}
                                            else{
                                                conn.query(thtsql, function(err, thtresult, f){
                                                    if(err){console.log(err);}
                                                    else{
                                                        var tmp1 = phtresult.length -1;
                                                        while(tmp1 >= 0){
                                                            hsforpt.push(JSON.parse(JSON.stringify(phtresult[tmp1])));
                                                            tmp1 --;
                                                        }
                                                        var tmp2 = thtresult.length -1;
                                                        while(tmp2 >= 0){
                                                            hsforpt.push(JSON.parse(JSON.stringify(thtresult[tmp2])));
                                                            tmp2 --;
                                                        }
                                                        var tmp3 = hashtags.length -1;
                                                        while(tmp3 >= 0){
                                                            hsforpt.push(JSON.parse(JSON.stringify(hashtags[tmp3])));
                                                            tmp3 --;
                                                        }
                                                        if(hashtags.length<1){ //when hashtag is shorter than 1
                                                            res.render('cari-result', {penobrols:penobrols, tandyas:tandyas, users:users, hashtags:hsresult, pthash:hsforpt});
                                                        }
                                                        else{ //when hashtag is longer than 1
                                                            for(var i =0; i<hashtags.length; i++){
                                                                if(hashtags[i].t_id === 0){
                                                                    ps.push(hashtags[i].p_id);
                                                                }
                                                                else{
                                                                    ts.push(hashtags[i].t_id);
                                                                }
                                                            }
                                                            newpsql = psqlMaker(ps);
                                                            newtsql = tsqlMaker(ts);
                                                            if(ps.length>=1 && ts.length >=1){
                                                                conn.query(newpsql, function(err, pResult, f){
                                                                    conn.query(newtsql, function(err, tResult, f){
                                                                        var temp1 = pResult.length -1;
                                                                        while(temp1 >= 0){
                                                                            hsresult.push(JSON.parse(JSON.stringify(pResult[temp1])));
                                                                            temp1 --;
                                                                        }
                                                                        var temp2 = tResult.length -1;
                                                                        while(temp2 >= 0){
                                                                            hsresult.push(JSON.parse(JSON.stringify(tResult[temp2])));
                                                                            temp2 --;
                                                                        }
                                                                        res.render('cari-result', {penobrols:penobrols, tandyas:tandyas, users:users, hashtags:hsresult, pthash:hsforpt});
                                                                    });
                                                                });
                                                            }
                                                            else if(ps.length<1){
                                                                conn.query(newtsql, function(err, tResult, f){
                                                                    var temp2 = tResult.length -1;
                                                                    while(temp2 >= 0){
                                                                        hsresult.push(JSON.parse(JSON.stringify(tResult[temp2])));
                                                                        temp2 --;
                                                                    }
                                                                    res.render('cari-result', {penobrols:penobrols, tandyas:tandyas, users:users, hashtags:tResult, pthash:hsforpt});
                                                                });
                                                            }
                                                            else{
                                                                conn.query(newpsql, function(err, pResult, f){
                                                                    var temp1 = pResult.length -1;
                                                                    while(temp1 >= 0){
                                                                        hsresult.push(JSON.parse(JSON.stringify(pResult[temp1])));
                                                                        temp1 --;
                                                                    }
                                                                    res.render('cari-result', {penobrols:penobrols, tandyas:tandyas, users:users, hashtags:pResult, pthash:hsforpt});
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
                                                    hsforpt.push(JSON.parse(JSON.stringify(thtresult[tmp4])));
                                                    tmp4 --;
                                                }
                                                var tmp5 = hashtags.length -1;
                                                while(tmp5 >= 0){
                                                    hsforpt.push(JSON.parse(JSON.stringify(hashtags[tmp5])));
                                                    tmp5 --;
                                                }
                                                if(hashtags.length<1){ //when hashtag is shorter than 1
                                                    res.render('cari-result', {penobrols:penobrols, tandyas:tandyas, users:users, hashtags:hsresult, pthash:hsforpt});
                                                }
                                                else{ //when hashtag is longer than 1
                                                    for(var i =0; i<hashtags.length; i++){
                                                        if(hashtags[i].t_id === 0){
                                                            ps.push(hashtags[i].p_id);
                                                        }
                                                        else{
                                                            ts.push(hashtags[i].t_id);
                                                        }
                                                    }
                                                    newpsql = psqlMaker(ps);
                                                    newtsql = tsqlMaker(ts);
                                                    if(ps.length>=1 && ts.length >=1){
                                                        conn.query(newpsql, function(err, pResult, f){
                                                            conn.query(newtsql, function(err, tResult, f){
                                                                var temp1 = pResult.length -1;
                                                                while(temp1 >= 0){
                                                                    hsresult.push(JSON.parse(JSON.stringify(pResult[temp1])));
                                                                    temp1 --;
                                                                }
                                                                var temp2 = tResult.length -1;
                                                                while(temp2 >= 0){
                                                                    hsresult.push(JSON.parse(JSON.stringify(tResult[temp2])));
                                                                    temp2 --;
                                                                }
                                                                res.render('cari-result', {penobrols:penobrols, tandyas:tandyas, users:users, hashtags:hsresult, pthash:hsforpt});
                                                            });
                                                        });
                                                    }
                                                    else if(ps.length<1){
                                                        conn.query(newtsql, function(err, tResult, f){
                                                            var temp2 = tResult.length -1;
                                                            while(temp2 >= 0){
                                                                hsresult.push(JSON.parse(JSON.stringify(tResult[temp2])));
                                                                temp2 --;
                                                            }
                                                            res.render('cari-result', {penobrols:penobrols, tandyas:tandyas, users:users, hashtags:tResult, pthash:hsforpt});
                                                        });
                                                    }
                                                    else{
                                                        conn.query(newpsql, function(err, pResult, f){
                                                            var temp1 = pResult.length -1;
                                                            while(temp1 >= 0){
                                                                hsresult.push(JSON.parse(JSON.stringify(pResult[temp1])));
                                                                temp1 --;
                                                            }
                                                            res.render('cari-result', {penobrols:penobrols, tandyas:tandyas, users:users, hashtags:pResult, pthash:hsforpt});
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
                                                    hsforpt.push(JSON.parse(JSON.stringify(phtresult[tmp4])));
                                                    tmp4 --;
                                                }
                                                var tmp6 = hashtags.length -1;
                                                while(tmp6 >= 0){
                                                    hsforpt.push(JSON.parse(JSON.stringify(hashtags[tmp6])));
                                                    tmp6 --;
                                                }
                                            }
                                            if(hashtags.length<1){ //when hashtag is shorter than 1
                                                res.render('cari-result', {penobrols:penobrols, tandyas:tandyas, users:users, hashtags:hsresult, pthash:hsforpt});
                                            }
                                            else{ //when hashtag is longer than 1
                                                for(var i =0; i<hashtags.length; i++){
                                                    if(hashtags[i].t_id === 0){
                                                        ps.push(hashtags[i].p_id);
                                                    }
                                                    else{
                                                        ts.push(hashtags[i].t_id);
                                                    }
                                                }
                                                newpsql = psqlMaker(ps);
                                                newtsql = tsqlMaker(ts);
                                                if(ps.length>=1 && ts.length >=1){
                                                    conn.query(newpsql, function(err, pResult, f){
                                                        conn.query(newtsql, function(err, tResult, f){
                                                            var temp1 = pResult.length -1;
                                                            while(temp1 >= 0){
                                                                hsresult.push(JSON.parse(JSON.stringify(pResult[temp1])));
                                                                temp1 --;
                                                            }
                                                            var temp2 = tResult.length -1;
                                                            while(temp2 >= 0){
                                                                hsresult.push(JSON.parse(JSON.stringify(tResult[temp2])));
                                                                temp2 --;
                                                            }
                                                            res.render('cari-result', {penobrols:penobrols, tandyas:tandyas, users:users, hashtags:hsresult, pthash:hsforpt});
                                                        });
                                                    });
                                                }
                                                else if(ps.length<1){
                                                    conn.query(newtsql, function(err, tResult, f){
                                                        var temp2 = tResult.length -1;
                                                        while(temp2 >= 0){
                                                            hsresult.push(JSON.parse(JSON.stringify(tResult[temp2])));
                                                            temp2 --;
                                                        }
                                                        res.render('cari-result', {penobrols:penobrols, tandyas:tandyas, users:users, hashtags:tResult, pthash:hsforpt});
                                                    });
                                                }
                                                else{
                                                    conn.query(newpsql, function(err, pResult, f){
                                                        var temp1 = pResult.length -1;
                                                        while(temp1 >= 0){
                                                            hsresult.push(JSON.parse(JSON.stringify(pResult[temp1])));
                                                            temp1 --;
                                                        }
                                                        res.render('cari-result', {penobrols:penobrols, tandyas:tandyas, users:users, hashtags:pResult, pthash:hsforpt});
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
});


app.get('/cari/load', function(req, res){
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
});

app.get(['/cari','/'], function(req, res){
    var todayDate = new Date();
    var todayDay = todayDate.getDate();
    if(parseInt(req.cookies.visitDate) !== todayDay){
        todayCount++;
    }
    res.cookie('visitDate', todayDay, {maxAge: 86400000, httpOnly: true });
    var ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var sql = 'select * from penobrol order by rand() limit 3';
    var sql2 = 'SELECT * FROM tandya order by rand() limit 3';
    var sql3 = '';
    var sql4 = '';
    //DO NOT SELECT *. Penobrol, tandya have different number of columns. union all will make an error.
    conn.query(sql, function(err, penobrol, fields){
        if(err){console.log(err);}
        else{
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
                                    if(p.length > 5){
                                        var temp1 = {};
                                        var temp2 = {};
                                        temp1 = p[1];
                                        p[1] = p[4];
                                        temp2 = p[2];
                                        p[2] = temp1;
                                        p[4] = temp2;
                                    }
                                    if(req.session.u_id){
                                        res.render('cari', {randoms:p, hashtag:phash, u_id:'req.session.u_id'});
                                    }
                                    else{
                                        res.render('cari', {randoms:p, hashtag:phash});
                                    }
                                }
                            });
                        }
                    });          
                }
            });
        }
    });
    var sql3 = '';
    if(req.session.u_id){
        sql3 = 'INSERT INTO access_info(u_id, ipAddress, browser) VALUES(?, INET_ATON(?), ?)';
        conn.query(sql3, [req.session.u_id, ipAddress, req.headers['user-agent']], function(err, access, fields){
            if(err){console.log(err);}    
        });
    }
    else{
        sql3 = 'INSERT INTO access_info(ipAddress, browser) VALUES(INET_ATON(?), ?)';
        conn.query(sql3, [ipAddress, req.headers['user-agent']], function(err, access, fields){
            if(err){console.log(err);}
        });
    }
});
/************FOR TANDYA************/
app.get('/tandya/add', tandya.getAddTandya);
app.post('/tandya/add', tandya.postAddTandya);
app.get('/tandya', tandya.getTandya);
app.post('/tandya/:tandya_no', tandya.postAddAnswer);
app.get(['/tandya/:tandya_no'], tandya.getViewTandya);
app.post('/tlikes/:id', tandya.likesTandya);
app.post('/tAnswerlikes/:id', tandya.likesAnswer);
app.post('/tandya/:tandya_no/:answer_no', tandya.postAddAcomment);
app.post('/twarning/', tandya.warningTandya);
app.get(['/tedit/:tandya_no'], tandya.getEditTandya);
app.post(['/tedit/:tandya_no'], tandya.postEditTandya);
app.get(['/taedit/:tandya_no/:tanswer_no'], tandya.getEditTanswer);
app.post(['/taedit/:tandya_no/:tanswer_no'], tandya.postEditTanswer);

/************FOR PENOBROL************/
app.get('/penobrol/add', penobrol.getAddPenobrol);
app.post('/penobrol/add', penobrol.postAddPenobrol);
app.post('/penobrol/:penobrol_no', penobrol.postAddComment);
app.get(['/penobrol'], penobrol.getPenobrol);
app.get(['/penobrol/:penobrol_no'], penobrol.getViewPenobrol);
app.post('/plikes/:id', penobrol.likesPenobrol);
app.post('/pCommentlikes/:id', penobrol.likesComment);
app.post('/penobrol/:penobrol_no/:comment_no', penobrol.postAddCcomment);
app.post('/pwarning/', penobrol.warningPenobrol);
app.get(['/pedit/:penobrol_no'], penobrol.getEditPenobrol);
app.post(['/pedit/:penobrol_no'], penobrol.postEditPenobrol);
app.get(['/pcedit/:penobrol_no/:pcomment_no'], penobrol.getEditPcomment);
app.post(['/pcedit/:penobrol_no/:pcomment_no'], penobrol.postEditPcomment);

/************FOR AKU************/
app.post('/aku/login', aku.login);
app.get(['/aku'], aku.welcome);
app.get('/aku/logout', aku.logout);
app.get('/aku/hilang', aku.hilang);
app.post('/daftar', aku.postDaftar);
app.get('/daftar', aku.getDaftar);
app.get('/daftar/auth/', aku.getDaftarAuth);
app.post('/aku/register', function(req, res){
    var sql = 'SELECT COUNT(u_id) AS u_id from users WHERE u_id = ?';
    var u_id = req.body.u_id;
    var result = 0;
    conn.query(sql, u_id, function(err, check, fields){
        if(parseInt(check[0].u_id) > 0){
            result = 1;
        }
        else{
            result = 0;
        }
        var responseData = {'result' : 'ok', 'u_id': result};
        res.json(responseData);
    }); 
});

var weeklyUpdate = schedule.scheduleJob({second: 55, minute: 59, hour:23, dayOfWeek: 0}, function(){
    var dateFrom = new Date();
    var dateTo = new Date();
    dateFrom.setDate(dateFrom.getDate() - 6);
    dateFrom = dateFrom.getFullYear()+'-'+(dateFrom.getMonth()+1)+'-'+dateFrom.getDate();
    dateTo = dateTo.getFullYear()+'-'+(dateTo.getMonth()+1)+'-'+dateTo.getDate();
    var tweeklyUpdate = 'select * from tandya where date between date(?) and date (?) order by score desc limit 2';
    var pweeklyUpdate = 'select * from penobrol where date between date(?) and date (?) order by score desc limit 2';
    var weeklyUpdate = 'INSERT INTO weekly (gold_p, silver_p, bronze_p, gold_t, silver_t, bronze_t) VALUES(?)';
    var weeklyArray = [];
    conn.query(tweeklyUpdate, [dateFrom, dateTo], function(err, tupdate, fields){
        if(err){console.log(err);}
        else{
            conn.query(pweeklyUpdate, [dateFrom, dateTo], function(err, pupdate, fields){
                if(err){console.log(err);}
                else{
                    for(var i = 0; i<pupdate.length; i++){
                        weeklyArray.push(pupdate[i].id);
                    }
                    console.log('after first for ' + weeklyArray.length);
                    if(weeklyArray.length<3){
                        while(weeklyArray.length <3){
                            weeklyArray.push(0);
                        }
                    }
                    for(var j = 0; j<tupdate.length; j++){
                        weeklyArray.push(tupdate[j].id);
                    }
                    if(weeklyArray.length<6){
                        while(weeklyArray.length<6){
                            weeklyArray.push(0);
                        }
                    }
                    conn.query(weeklyUpdate, [weeklyArray], function(err, finalUpdate, fields){
                        if(err){console.log(err);}
                    });
                }
            });
        }
    });
});

var todayCountsql = 'INSERT INTO daily_count (visitCount) VALUES (?)';
var dailyVisitCount = schedule.scheduleJob({second: 59, minute: 59, hour:23}, function(){
    conn.query(todayCountsql, todayCount, function(err, updateCount, field){
        if(err){console.log(err);}
        else{
            todayCount = 1;
        }
    });
});

app.listen(db_config.port, '0.0.0.0', function(){
  console.log('Connected, 80 port!');
});

app.all('*', function(req, res){
   res.redirect('cari'); 
});

//        This is the code for hashtag previously
//        var search_string = cari.replace('#', '');
//        var sql1 = 'select * from penobrol';
//        var sql2 = 'select * from tandya';
//        var sql3 = 'select * from hashtag';
//        conn.query(sql1, function(err, penobrol, f){
//            conn.query(sql2, function(err, tandya, f){
//                conn.query(sql3, function(err, hashtag, f){
//                    var prawdata = JSON.parse(JSON.stringify(penobrol));
//                    var trawdata = JSON.parse(JSON.stringify(tandya));
//                    for(var i =0; i<hashtag.length; i++){
//                        var temp = [];
//                        temp.push(hashtag[i].ht1, hashtag[i].ht2, hashtag[i].ht3, hashtag[i].ht4, hashtag[i].ht5, hashtag[i].ht6, hashtag[i].ht7);
//                        console.log('temp : ' + temp);
//                        for(var j = 0; j<7; j++){
//                            if(temp[j] == search_string){   
//                                if(hashtag[i].t_id === 0){ //if the hashtag is from penobro;
//                                    //id number starts from 1 not 0
//                                    console.log('in if : ' + cari_result);
//                                    cari_result.push(prawdata[(hashtag[i].p_id)-1]);
//                                }
//                                else{ //if the hashtag is from tandya
//                                    //id number starts from 1 not 0
//                                    console.log('in else : ' +cari_result);
//                                    cari_result.push(trawdata[(hashtag[i].t_id)-1]);
//                                }
//                            }
//                        }
//                    }
//                    res.render('cari-result', {result:cari_result});                    
//                });
//            });
//        });



