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
var path = require('path');
var favicon = require('serve-favicon');
var schedule = require('node-schedule');
var db_config =require('./config.json');
var fs = require('fs');
var useragent = require('express-useragent');
const AWS = require('aws-sdk');
const imageThumbnail = require('image-thumbnail');

const s3 = new AWS.S3({
    accessKeyId: db_config.AWS_ACCESS_KEY,
    secretAccessKey: db_config.AWS_SECRET_ACCESS_KEY,
    region : 'ap-southeast-1'
});

app.use(useragent.express());
app.use(favicon(path.join(__dirname,'./info', 'beritamus logo.png')));

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
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
app.use(express.json({ limit : "50mb" }));
app.use(express.urlencoded({ limit:"50mb", extended: false }));

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

const poolConfig = {
    host     : db_config.host,
    user     : db_config.user,
    password : db_config.password,
    database : db_config.database
};

exports.app = app;
exports.router = router;
exports.conn = conn;
exports.s3 = s3;
exports.sch = schedule;
exports.poolConfig = poolConfig;

var penobrol = require('./back/penobrol/penobrol');
var tandya = require('./back/tandya/tandya');
var aku = require('./back/aku/aku');
var cari = require('./back/cari/cari');
var backSystem = require('./back/backsystem')
var jsForBack = require('./back/jsForBack.js');

var todayTotal = 0;
var todayCount = 0;
app.use(function(req, res, next){
    var tmp = new Date();
    var todayDay = tmp.getDate()+1;
    var nowH = tmp.getHours() * 60 * 60;
    var nowM = tmp.getMinutes() * 60;
    var nowS = tmp.getSeconds();
    var cookieAge = (86400000-((nowH + nowM + nowS) * 1000));
    if(req.cookies.visitCount){
        todayTotal++;
        var count = parseInt(req.cookies.visitCount) +1;
        res.cookie('visitCount', count, {maxAge: cookieAge, httpOnly: true });
    }else{
        todayTotal++;
        todayCount++;
        res.cookie('visitCount', 0, {maxAge: cookieAge, httpOnly: true });
    }
    next();
});

/************************FOR SYSTEM************************/
app.get('/chonggwalpage', backSystem.getChonggwalpage);
app.post('/chonggwalpage', backSystem.postChonggwalpage);

/************************FOR AKU************************/
app.get('/aku/findMyIdPw', aku.getFindMyIdPw);
app.post('/aku/findMyIdPw', aku.postFindMyIdPw);
app.post('/aku/login', aku.login);
app.get(['/aku'], aku.welcome);
app.get('/aku/logout', aku.logout);
app.post('/aku/daftar', aku.postDaftar);
app.get('/aku/daftar', aku.getDaftar);
app.get('/aku/daftar/auth/', aku.getDaftarAuth);
app.get('/aku/changeUserInfo', aku.getChangeUserInfo);
app.post('/aku/changeUserInfo', aku.postChangeUserInfo);
app.get('/aku/changeUserInfoLogin', aku.getChangeUserInfoLogin);
app.post('/aku/changeUserInfoLogin', aku.postChangeUserInfoLogin);
app.post('/aku/register', aku.checkUserId);

/************************FOR CARI************************/
app.get(['/cari','/', '/cari/load'], cari.getCari);
app.get('/cari/search', cari.getSearch);

/************************FOR TANDYA************************/
app.get('/tandya', tandya.getTandya);

/************view************/
app.get(['/tandya/view/:tandya_no'], tandya.getViewTandya);

/************add************/
app.get('/tandya/add/article', tandya.getAddTandya);
app.post('/tandya/add/article', tandya.postAddTandya);
app.post('/tandya/add/answer/:tandya_no', tandya.postAddAnswer);
app.post('/tandya/add/acomment/:t_id/:ta_id', tandya.postAddAcomment);

/************like************/
app.post('/tandya/like/article/:id', tandya.likesTandya);
app.post('/tandya/like/answer/:id', tandya.likesAnswer);

/************warn************/
app.post('/tandya/warn/', tandya.warningTandya);

/************edit************/
app.get(['/tandya/edit/article/:tandya_no'], tandya.getEditTandya);
app.post(['/tandya/edit/article/:tandya_no'], tandya.postEditTandya);
app.get(['/tandya/edit/answer/:tandya_no/:tanswer_no'], tandya.getEditTanswer);
app.post(['/tandya/edit/answer/:tandya_no/:tanswer_no'], tandya.postEditTanswer);

/************delete************/
app.post('/tandya/delete/article/:id', tandya.postDeleteTandya);
app.post('/tandya/delete/answer/:id', tandya.postDeleteTanswer);
app.post('/tandya/delete/acomment/:id', tandya.postDeleteTacomment);


/************************FOR PENOBROL************************/
app.get(['/penobrol'], penobrol.getPenobrol);

/************view************/
app.get(['/penobrol/view/:penobrol_no'], penobrol.getViewPenobrol);

/************add************/
app.get('/penobrol/add/article', penobrol.getAddPenobrol);
app.post('/penobrol/add/article', penobrol.postAddPenobrol);
app.post('/penobrol/add/comment/:penobrol_no', penobrol.postAddComment);
app.post('/penobrol/add/ccomment/:p_id/:pc_id', penobrol.postAddCcomment);

/************like************/
app.post('/penobrol/like/article/:id', penobrol.likesPenobrol);
app.post('/penobrol/like/comment/:id', penobrol.likesComment);

/************warn************/
app.post('/penobrol/warn/', penobrol.warningPenobrol);

/************edit************/
app.get(['/penobrol/edit/article/:penobrol_no'], penobrol.getEditPenobrol);
app.post(['/penobrol/edit/article/:penobrol_no'], penobrol.postEditPenobrol);
app.get(['/penobrol/edit/comment/:penobrol_no/:pcomment_no'], penobrol.getEditPcomment);
app.post(['/penobrol/edit/comment/:penobrol_no/:pcomment_no'], penobrol.postEditPcomment);

/************delete************/
app.post('/penobrol/delete/article/:id', penobrol.postDeletePenobrol);
app.post('/penobrol/delete/comment/:id', penobrol.postDeletePcomment);
app.post('/penobrol/delete/ccomment/:id', penobrol.postDeletePccomment);


function saveImage(path, filename, data, callback) {
    const params = {
        'Bucket':'beritamus',
        'Key': path + "/" + filename,
        'ACL':'public-read',
        'ContentEncoding': 'base64',
        'Body': Buffer.from(data, 'base64')
    };
    s3.putObject(params, callback);
}

app.post('/image', (req, res) => {
    var img = req.body.img;
    console.log(img);
    var data =img.replace(/^data:image\/\w+;base64,/, "");
    var filename = jsForBack.generateFilename();

    switch (img.split(";")[0].split("/")[1]) {
        case "jpeg": filename += '.jpg'; break;
        case "gif": filename += '.gif'; break;
        case "x-icon": filename += '.ico'; break;
        case "png": filename += '.png'; break;
        default: /* Raise error */ break;
    }
    imageThumbnail(data).then((thumbnail) => {
        saveImage("images", filename, data, (err) => {
            if(err) {
                console.log("err: ", err);
                /* Raise error */
            } else {
                saveImage("images/thumbnail", filename, thumbnail, (err) => {
                    if(err) {
                        console.log("err: ", err);
                        /* Raise error */
                    } else {
                        res.json({'filename': filename});
                    }
                })
            }
        });
    });
});

app.listen(db_config.port, '0.0.0.0', function(){
    console.log('Connected, 80 port!');
});

app.all('*', function(req, res){
    res.redirect('cari');
});
