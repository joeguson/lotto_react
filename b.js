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
app.use(useragent.express());
app.use(favicon(path.join(__dirname,'./info', 'beritamus logo.png')));
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
app.use(express.static('back'));
app.use(express.static('public'));
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
app.get('/aku/findMyIdPw', aku.getFindMyIdPw);
app.post('/aku/login', aku.login);
app.get(['/aku'], aku.welcome);
app.get('/aku/logout', aku.logout);
app.get('/aku/hilang', aku.hilang);
app.post('/aku/daftar', aku.postDaftar);
app.get('/aku/daftar', aku.getDaftar);
app.get('/aku/daftar/auth/', aku.getDaftarAuth);
app.post('/aku/register', aku.checkUserId);

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
app.post('/penobroldelete/:id', penobrol.postDeletePenobrol);
app.post('/pcommentdelete/:id', penobrol.postDeletePcomment);
app.post('/pccommentdelete/:id', penobrol.postDeletePccomment);

function generateFilename() {
    const d = new Date();
    var str = "";
    var str = d.getFullYear().toString() +
        (d.getMonth() + 1).toString() +
        d.getDate().toString() +
        d.getHours().toString() +
        d.getMinutes().toString() +
        d.getSeconds().toString() +
        Math.floor(Math.random() * 100000).toString();

//    const d = new Date();
//
//    var str = d.getFullYear().toString() +
//        (d.getMonth() + 1).toString() +
//        d.getDate().toString() +
//        d.getHours().toString() +
//        d.getMinutes().toString() +
//        d.getSeconds().toString() +
//        Math.floor(Math.random() * 100000).toString() +
//         ".png";
    return str;
}

app.post('/image', (req, res) => {
    var img = req.body.img;
    var d=new Date().valueOf();
    var data =img.replace(/^data:image\/\w+;base64,/, "");
    var buf = new Buffer(data, 'base64');
    var filename = generateFilename();
    if("jpeg"==img.split(";")[0].split("/")[1]){
        filename += '.jpg';
    }
    if("gif"==img.split(";")[0].split("/")[1]){
        filename += '.gif';
    }
    if("x-icon"==img.split(";")[0].split("/")[1]){
        filename += '.ico';
    }
    if("png"==img.split(";")[0].split("/")[1]){
        filename += '.png';
    }
    fs.writeFile('./images/' + filename, buf, (err) => {
        if(err) console.log(err);
    });
    res.json({'filename': filename});
});

app.delete('/image/:image_id', (req, res) =>{
  var id = req.params.image_id;
  console.log(req.session.u_id);
  console.log(id);
  res.send('hi');
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
