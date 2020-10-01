const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const config =require('./config.json');
const useragent = require('express-useragent');
const path = require('path');
const fs = require('fs');

app.use(useragent.express());
app.use(express.static(path.join(__dirname, './front/build')));
app.use(express.json({ limit : "50mb" }));
app.use(express.urlencoded({ limit:"50mb", extended: false }));
app.locals.pretty = true;
app.use(express.static('back'));
app.set('views', './front/html');
app.set('case sensitive routing', false);
app.use(cookieParser());

const poolConfig = config.db_config;
exports.poolConfig = poolConfig;

const cari = require('./back/cari');
const service = require('./service/serviceUtil');

// fs.readFile('../lotto_combination/lotto_history.txt', 'utf8', async function (err, data){
//     const arr = data.split('\n').map(e => e.trim().split(','));
// });

/* ===== router ===== */
app.use('/cari', cari);

app.listen(config.port, '0.0.0.0', function(){
    console.log('Connected, ' + config.port + ' port!');
});

app.all('*', function(req, res){
    res.redirect('/cari');
});
