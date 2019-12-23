var express = require('express');
var app = express();
var nodemailer = require('nodemailer');
var router = express.Router();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var mysql = require('mysql');
const mysql2 = require('mysql2/promise');
var path = require('path')
var favicon = require('serve-favicon');
var schedule = require('node-schedule');
var db_config =require('./config.json');
var fs = require('fs');
var useragent = require('express-useragent');
var penobrol = require('./back/penobrol/penobrol');
var tandya = require('./back/tandya/tandya');
var aku = require('./back/aku/aku');
var cari = require('./back/cari/cari');
var jsForJade = require('./front/js/jsForAllJade');
app.use(useragent.express());
app.use(favicon(path.join(__dirname,'./info', 'logo2.png')));
const pool = mysql2.createPool(
  {
    host     : db_config.host,
    user     : db_config.user,
    password : db_config.password,
    database : db_config.database
  }
);
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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.locals.pretty = true;

app.use(express.static('front'));
app.use("/jade", express.static('/'));
app.set('view engine', 'jade');
app.set('views', './front/html');
app.use(cookieParser());

conn.connect();

exports.app = app;
exports.router = router;
exports.conn = conn;
exports.pool = pool;
exports.sch = schedule;

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


/************FOR CARI************/
app.get(['/cari','/'], cari.getCari);
app.get('/cari/search', cari.getSearch);
app.get(['/cari/load'], cari.getLoad);

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
app.post('/pcomment/:penobrol_no', penobrol.postAddComment);
app.get(['/penobrol'], penobrol.getPenobrol);
app.get(['/penobrol/:penobrol_no'], penobrol.getViewPenobrol);
app.post('/plikes/:id', penobrol.likesPenobrol);
app.post('/pCommentlikes/:id', penobrol.likesComment);
app.post('/pccomment/:p_id/:pc_id', penobrol.postAddCcomment);
app.post('/pwarning/', penobrol.warningPenobrol);
app.get(['/pedit/:penobrol_no'], penobrol.getEditPenobrol);
app.post(['/pedit/:penobrol_no'], penobrol.postEditPenobrol);
app.get(['/pcedit/:penobrol_no/:pcomment_no'], penobrol.getEditPcomment);
app.post(['/pcedit/:penobrol_no/:pcomment_no'], penobrol.postEditPcomment);

app.listen(db_config.port, '0.0.0.0', function(){
  console.log('Connected, 80 port!');
});

app.all('*', function(req, res){
   res.redirect('cari');
});
