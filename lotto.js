const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const config =require('./config.json');
const useragent = require('express-useragent');
const fs = require('fs');

app.use(useragent.express());

app.use(express.json({ limit : "50mb" }));
app.use(express.urlencoded({ limit:"50mb", extended: false }));

app.locals.pretty = true;

app.use(express.static('front'));
app.use(express.static('back'));
app.set('views', './front/html');
app.set('case sensitive routing', false);
app.use(cookieParser());

const poolConfig = config.db_config;
exports.poolConfig = poolConfig;

const cari = require('./back/cari');
const service = require('./service/serviceUtil');

fs.readFile('../lotto_combination/lotto_history.txt', 'utf8', async function (err, data){
    const arr = data.split('\n').map(e => e.trim().split(','));

    arr.forEach(e => {
        e[0] = parseInt(e[0]);
        e[1] = e[1].replace('.', '-');
        e[2] = parseInt(e[2]);
        e[3] = parseInt(e[3]);
        e[4] = parseInt(e[4]);
        e[5] = parseInt(e[5]);
        e[6] = parseInt(e[6]);
        e[7] = parseInt(e[7]);
    });

    arr.forEach(e => {
        e[1] = e[1].replace('.', '-');
    });
    arr.reverse();

    console.log(arr.length);
    let count = 0;

    for(let i = 900; i < arr.length; i++) {
        count++;
    }
    console.log('=======');
});

/* ===== router ===== */
app.use('/cari', cari);

app.listen(config.port, '0.0.0.0', function(){
    console.log('Connected, ' + config.port + ' port!');
});

app.all('*', function(req, res){
    res.redirect('/cari');
});
