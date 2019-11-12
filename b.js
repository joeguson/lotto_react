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
        host     : 'beritamus-db01.cqtxhcf9tkke.ap-southeast-1.rds.amazonaws.com',
        user     : 'beritamusdb',
        password : 'TlqkfEnfgdjqhk$$',
        database : 'beritamus'
    })
}));
var conn = mysql.createConnection(
    {
      host     : 'beritamus-db01.cqtxhcf9tkke.ap-southeast-1.rds.amazonaws.com',
      user     : 'beritamusdb',
      password : 'TlqkfEnfgdjqhk$$',
      database : 'beritamus'
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
var testing = require('./testing');

var todayCount = 1;


app.get('/test', testing.testing1);

/************FOR CARI************/
app.get('/cari/search', function(req, res){
    var cari = req.query.search;
    var cari_result = [];
    if(cari.indexOf('#')>=0){ //one hashtag - hashtag, title에서 검색
        var search_string = cari.replace('#', '');
        var sql1 = 'select * from penobrol';
        var sql2 = 'select * from tandya';
        var sql3 = 'select * from hashtag';
        conn.query(sql1, function(err, penobrol, f){
            conn.query(sql2, function(err, tandya, f){
                conn.query(sql3, function(err, hashtag, f){
                    var prawdata = JSON.parse(JSON.stringify(penobrol));
                    var trawdata = JSON.parse(JSON.stringify(tandya));
                    for(var i =0; i<hashtag.length; i++){
                        var temp = [];
                        temp.push(hashtag[i].ht1, hashtag[i].ht2, hashtag[i].ht3, hashtag[i].ht4, hashtag[i].ht5, hashtag[i].ht6, hashtag[i].ht7);
                        for(var j = 0; j<7; j++){
                            if(temp[j] == search_string){   
                                if(hashtag[i].t_id === 0){ //if the hashtag is from penobro;
                                    //id number starts from 1 not 0
                                    cari_result.push(prawdata[(hashtag[i].p_id)-1]);
                                }
                                else{ //if the hashtag is from tandya
                                    //id number starts from 1 not 0
                                    cari_result.push(trawdata[(hashtag[i].t_id)-1]);
                                }
                            }
                        }
                    }
                    res.render('cari-result', {result:cari_result});                    
                });
            });
        });
    }
    else{
        var sql4 = 'SELECT * FROM penobrol AS result WHERE MATCH(title) AGAINST(?)';
        var sql5 = 'SELECT * FROM penobrol AS result WHERE MATCH(content) AGAINST(?)';
        var sql6 = 'SELECT * FROM tandya AS result WHERE MATCH(question) AGAINST(?)';
        var sql7 = 'SELECT * FROM tandya AS result WHERE MATCH(content) AGAINST(?)';
        conn.query(sql4, cari, function(err, penobrol_t, f){
            conn.query(sql5, cari, function(err, penobrol_c, f){
                conn.query(sql6, cari, function(err, tandya_q, f){
                    conn.query(sql7, cari, function(err, tandya_c, f){
                        //one result has mnay children. need to seperate them.
                        if(penobrol_t.length>0){
                            var temp1 = penobrol_t.length -1;
                            while(temp1 >= 0){
                                cari_result.push(JSON.parse(JSON.stringify(penobrol_t[temp1])));
                                temp1 --;
                            }
                        }
                        if(penobrol_c.length>0){
                            var temp2 = penobrol_c.length -1;
                            while(temp2 >= 0){
                                cari_result.push(JSON.parse(JSON.stringify(penobrol_c[temp2])));
                                temp2 --;
                            }
                        }
                        if(tandya_q.length>0){
                            var temp3 = tandya_q.length -1;
                            while(temp3 >= 0){
                                cari_result.push(JSON.parse(JSON.stringify(tandya_q[temp3])));
                                temp3 --;
                            }
                        }
                        if(tandya_c.length>0){
                            var temp4 = tandya_c.length -1;
                            while(temp4 >= 0){
                                cari_result.push(JSON.parse(JSON.stringify(tandya_c[temp4])));
                                temp4 --;
                            }
                        }
                        res.render('cari-result', {result:cari_result});
                    });    
                });    
            });

        });
    }
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
    sql = 'SELECT * FROM penobrol order by rand() limit 3';
    sql2 = 'SELECT * FROM tandya order by rand() limit 3';
    conn.query(sql, function(err, penobrol, fields){
        conn.query(sql2, function(err, tandya, fields){
            if(err){console.log(err);}
            else{
                var p = JSON.parse(JSON.stringify(penobrol));
                var t = JSON.parse(JSON.stringify(tandya));
                p = p.concat(t);
                var responseData = {'result' : 'ok', 'data': p};
                res.json(responseData);
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
    //DO NOT SELECT *. Penobrol, tandya have different number of columns. union all will make an error.
    conn.query(sql, function(err, penobrol, fields){
        if(err){console.log(err);}
        else{
            conn.query(sql2, function(err, tandya, fields){
                var p = JSON.parse(JSON.stringify(penobrol));
                var t = JSON.parse(JSON.stringify(tandya));
                p = p.concat(t);
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
                    res.render('cari', {randoms:p, u_id:'req.session.u_id'});
                }
                else{
                    res.render('cari', {randoms:p});
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

app.listen(80, '0.0.0.0', function(){
  console.log('Connected, 80 port!');
});

app.all('*', function(req, res){
   res.redirect('cari'); 
});


