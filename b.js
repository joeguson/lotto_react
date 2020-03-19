const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const path = require('path');
const favicon = require('serve-favicon');
const config =require('./config.json');
const useragent = require('express-useragent');
const AWS = require('aws-sdk');

const s3 = new AWS.S3(config.aws_config);

app.use(useragent.express());
app.use(favicon(path.join(__dirname,'./info', 'beritamus logo.png')));

app.use(session({
    secret : 'hithere@#',
    resave: false,
    saveUninitialized: true,
    store: new MySQLStore(config.db_config)
}));

app.use(express.json({ limit : "50mb" }));
app.use(express.urlencoded({ limit:"50mb", extended: false }));

app.locals.pretty = true;

app.use(express.static('front'));
app.use(express.static('vendor'));
app.use(express.static('back'));
app.use(express.static('images'));
app.use("/pug", express.static('/'));
app.set('view engine', 'pug');
app.set('views', './front/html');
app.set('case sensitive routing', false);
app.use(cookieParser());

const poolConfig = config.db_config;

exports.s3 = s3;
exports.poolConfig = poolConfig;

const apiRouter = require('./api/api');
const aku = require('./back/aku');
const cari = require('./back/cari');
const penobrol = require('./back/penobrol');
const tandya = require('./back/tandya');
const youtublog = require('./back/youtublog');
const samusil = require('./back/samusil');

let todayTotal = 0;
let todayCount = 0;

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

/* ===== router ===== */
app.use('/api', apiRouter);
app.use('/cari', cari);
app.use('/aku', aku);
app.use('/tandya', tandya);
app.use('/penobrol', penobrol);
app.use('/youtublog', youtublog);
app.use('/samusil', samusil);


app.listen(config.port, '0.0.0.0', function(){
    console.log('Connected, ' + config.port + ' port!');
});

app.all('*', function(req, res){
    res.redirect('cari');
});
