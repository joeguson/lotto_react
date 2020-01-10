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
var backSystem = require('./back/backsystem')
var jsForBack = require('./back/jsForBack.js');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    accessKeyId: db_config.AWS_ACCESS_KEY,
    secretAccessKey: db_config.AWS_SECRET_ACCESS_KEY,
    region : 'ap-southeast-1'
});

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
app.use(express.static('images'));
app.use("/jade", express.static('/'));
app.set('view engine', 'jade');
app.set('views', './front/html');
app.use(cookieParser());

conn.connect();

exports.app = app;
exports.router = router;
exports.conn = conn;
exports.s3 = s3;
exports.pool = pool;
exports.sch = schedule;

/************FOR SYSTEM************/
app.get('/chonggwalpage', backSystem.getChonggwalpage);
app.post('/chonggwalpage', backSystem.postChonggwalpage);

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
app.get(['/cari','/', '/cari/load'], cari.getCari);
app.get('/cari/search', cari.getSearch);

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
app.post('/tandyadelete/:id', tandya.postDeleteTandya);
app.post('/tanswerdelete/:id', tandya.postDeleteTanswer);
app.post('/tacommentdelete/:id', tandya.postDeleteTacomment);

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

app.post('/image', (req, res) => {
    var img = req.body.img;
    var data =img.replace(/^data:image\/\w+;base64,/, "");
    var buf = new Buffer(data, 'base64');
    var filename = jsForBack.generateFilename();
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
    var params = {
        'Bucket':'beritamus',
        'Key': 'images/'+filename,
        'ACL':'public-read',
        'ContentEncoding': 'base64',
        'Body':buf
    }
    s3.putObject(params, function(err, data){
        if(err){
            console.log("err: ", err)
        }
        console.log('============')
        console.log("data: ", data)
    })
    res.json({'filename': filename});
    // var img = req.body.img;
    // var data =img.replace(/^data:image\/\w+;base64,/, "");
    // var buf = new Buffer(data, 'base64');
    // var filename = jsForBack.generateFilename();
    // if("jpeg"==img.split(";")[0].split("/")[1]){
    //     filename += '.jpg';
    // }
    // if("gif"==img.split(";")[0].split("/")[1]){
    //     filename += '.gif';
    // }
    // if("x-icon"==img.split(";")[0].split("/")[1]){
    //     filename += '.ico';
    // }
    // if("png"==img.split(";")[0].split("/")[1]){
    //     filename += '.png';
    // }
    // fs.writeFile('./images/' + filename, buf, (err) => {
    //     if(err) console.log(err);
    // });
    // res.json({'filename': filename});
});


app.listen(db_config.port, '0.0.0.0', function(){
  console.log('Connected, 80 port!');
});

app.all('*', function(req, res){
   res.redirect('cari');
});
