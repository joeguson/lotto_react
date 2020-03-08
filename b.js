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

app.use(express.json({ limit : "50mb" }));
app.use(express.urlencoded({ limit:"50mb", extended: false }));

app.locals.pretty = true;

app.use(express.static('front'));
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
const jsForBack = require('./back/jsForBack.js');

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

 function deleteImage(path, filename, callback) {
     const params = {
         'Bucket':'beritamus',
         'Key': path + "/" + filename,
     };
     s3.deleteObject(params, callback);
 }

 app.delete('/image', (req, res) => {
     let img = req.body.img;
     deleteImage("images", filename, (err) => {
         if(err) {
             console.log("err: ", err);
             /* Raise error */
         } else {
             deleteImage("images/thumbnail", filename,(err) => {
                 if(err) {
                     console.log("err: ", err);
                     /* Raise error */
                 } else {
                     res.json({"message" : "deleted"});
                 }
             })
         }
     });
 });

app.post('/image', (req, res) => {
    let img = req.body.img;
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
