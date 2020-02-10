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
var config =require('./config.json');
var fs = require('fs');
var useragent = require('express-useragent');
const AWS = require('aws-sdk');
const imageThumbnail = require('image-thumbnail');

const s3 = new AWS.S3(config.aws_config);

app.use(useragent.express());
app.use(favicon(path.join(__dirname,'./info', 'beritamus logo.png')));

app.use(session({
    secret : 'hithere@#',
    resave: false,
    saveUninitialized: true,
    store: new MySQLStore(config.db_config)
}));

var conn = mysql.createConnection(config.db_config);
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
app.use(express.json({ limit : "50mb" }));
app.use(express.urlencoded({ limit:"50mb", extended: false }));

app.locals.pretty = true;

app.use(express.static('front'));
app.use(express.static('back'));
app.use(express.static('images'));
app.use("/jade", express.static('/'));
app.set('view engine', 'jade');
app.set('views', './front/html');
app.set('case sensitive routing', false);
app.use(cookieParser());

conn.connect();

const poolConfig = config.db_config;

exports.app = app;
exports.router = router;
exports.conn = conn;
exports.s3 = s3;
exports.sch = schedule;
exports.poolConfig = poolConfig;

const penobrol = require('./back/penobrol/penobrol');
const tandya = require('./back/tandya/tandya');
// const aku = require('./back/aku/aku');
const apiRouter = require('./api/api');
const aku = require('./back/aku/aku');
const cari = require('./back/cari/cari');
const backSystem = require('./back/backsystem');
const jsForBack = require('./back/jsForBack.js');

let todayTotal = 0;
let todayCount = 0;

// app.use(function(req, res, next){
//     var tmp = new Date();
//     var todayDay = tmp.getDate()+1;
//     var nowH = tmp.getHours() * 60 * 60;
//     var nowM = tmp.getMinutes() * 60;
//     var nowS = tmp.getSeconds();
//     var cookieAge = (86400000-((nowH + nowM + nowS) * 1000));
//     if(req.cookies.visitCount){
//         todayTotal++;
//         var count = parseInt(req.cookies.visitCount) +1;
//         res.cookie('visitCount', count, {maxAge: cookieAge, httpOnly: true });
//     }else{
//         todayTotal++;
//         todayCount++;
//         res.cookie('visitCount', 0, {maxAge: cookieAge, httpOnly: true });
//     }
//     next();
// });

 app.use('/api', apiRouter);

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

 // app.use('/aku', aku);
 app.use('/tandya', tandya);
 app.use('/penobrol', penobrol);

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
    let img = req.body.img;
    console.log(img);
    let data =img.replace(/^data:image\/\w+;base64,/, "");
    let filename = jsForBack.generateFilename();

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

app.listen(config.port, '0.0.0.0', function(){
    console.log('Connected, ' + config.port + ' port!');
});

app.all('*', function(req, res){
    res.redirect('cari');
});
