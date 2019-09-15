var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var mysql = require('mysql');
app.use(session({
    secret : 'hithere@#',
    resave: false,
    saveUninitialized: true,
    store: new MySQLStore({
        host     : '112.157.39.243',
        user     : 'root',
        password : 'TlqkfEnfgdjqhk1@',
        database : 'beritamus'
    })
}));
var conn = mysql.createConnection(
    {
      host     : '112.157.39.243',
      user     : 'root',
      password : 'TlqkfEnfgdjqhk1@',
      database : 'beritamus'
    }
);
conn.connect();
exports.conn = conn;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.locals.pretty = true;
app.use(express.static('css'));
app.use("/jade", express.static('/css'));
app.set('view engine', 'jade');
app.set('views', './jade');

var testing = require('./testing');
var penobrol = require('./penobrol');
var tandya = require('./tandya');
var aku = require('./aku');
var cari = require('./cari');
var testing = require('./testing');

app.get('/test', function(req, res){
    var shit = [];
    var prandom = [];
    var sql = 'SELECT total_p, total_t FROM overview where id =1';
    var sql2 = 'Select * from penobrol where id = ?';
    conn.query(sql, function(err, total, f){
        prandom = cari.randomer(total[0].total_p);
        console.log(prandom);
    });
    res.render('test');
});

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
        if(cari.indexOf(' ')>0){//more than one word, no hashtag -content, title, question 에서 검색
            var sql = 'SELECT * FROM penobrol AS result WHERE MATCH(title) AGAINST(?)';
            var sql2 = 'SELECT * FROM penobrol AS result WHERE MATCH(content) AGAINST(?)';
            var sql3 = 'SELECT * FROM tandya AS result WHERE MATCH(question) AGAINST(?)';
            var sql4 = 'SELECT * FROM tandya AS result WHERE MATCH(content) AGAINST(?)';
            conn.query(sql, cari, function(err, penobrol_t, f){
                conn.query(sql2, cari, function(err, penobrol_c, f){
                    conn.query(sql3, cari, function(err, tandya_q, f){
                        conn.query(sql4, cari, function(err, tandya_c, f){
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
        else{//just one word, no hashtag - title, question, hashtag에서 검색
            //like? match? will be used.
            var sql = 'SELECT * FROM penobrol WHERE content LIKE "%"?"%";';
            var sql2 = 'SELECT * FROM tandya WHERE content LIKE "%"?"%";';
            conn.query(sql, cari, function(err, penobrol, f){
                conn.query(sql2, cari, function(err, tandya, f){
                    if(penobrol.length>0){
                        var temp1 = penobrol.length -1;
                        while(temp1 >= 0){
                            cari_result.push(JSON.parse(JSON.stringify(penobrol[temp1])));
                            temp1 --;
                        }
                    }
                    if(tandya.length>0){
                        var temp = tandya.length -1;
                        while(temp >= 0){
                            cari_result.push(JSON.parse(JSON.stringify(tandya[temp])));
                            temp --;
                        }
                    }
                    console.log(cari_result);
                    res.render('cari-result', {result:cari_result});
                });
            });
        }
    }
});
app.get('/cari/load', function(req, res){
    sql = 'SELECT * FROM penobrol order by rand() limit 5';
    sql2 = 'SELECT * FROM tandya order by rand() limit 5';
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
    res.render('cari');
});

/************FOR TANDYA************/
app.get('/tandya/add', tandya.getAddTandya);
app.post('/tandya/add', tandya.postAddTandya);
app.get('/tandya', tandya.getTandya);
app.post('/tandya/:tandya_no', tandya.postAddComment);
app.get(['/tandya/:tandya_no'], tandya.getViewTandya);
app.post('/tlikes/:id', tandya.likesTandya);
app.post('/tAnswerlikes/:id', tandya.likesAnswer);

/************FOR PENOBROL************/
app.get('/penobrol/add', penobrol.getAddPenobrol);
app.post('/penobrol/add', penobrol.postAddPenobrol);
app.post('/penobrol/:penobrol_no', penobrol.postAddComment);
app.get(['/penobrol'], penobrol.getPenobrol);
app.get(['/penobrol/:penobrol_no'], penobrol.getViewPenobrol);
app.post('/plikes/:id', penobrol.likesPenobrol);
app.post('/pCommentlikes/:id', penobrol.likesComment);

/************FOR AKU************/
app.post('/aku/login', aku.login);
app.get(['/aku', '/aku/login'], aku.welcome);
app.get('/aku/logout', aku.logout);
app.get('/aku/hilang', aku.hilang);
app.post('/register', aku.postRegister);
app.get('/register', aku.getRegister);
app.post('/aku/register', function(req, res){
    var sql = 'SELECT COUNT(u_id) AS u_id from users WHERE u_id = ?';
    var u_id = req.body.u_id;
    var result = 0;
    conn.query(sql, u_id, function(err, check, field){
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
app.listen(3000, function(){
  console.log('Connected, 3000 port!');
});
