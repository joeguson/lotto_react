//url - '/api/opengraph'
const route = require('express').Router();
const jsForBack = require('../back/jsForBack.js');
const ogs = require('open-graph-scraper');

/* ===== samusil ===== */

route.post('/', (req, res) => {
    console.log('hi');
    let urlSource = req.body.urlSource;
    let options = {'url': urlSource, 'encoding': 'utf8', 'timeout': 10000};
    ogs(options, function (error, results) {
        console.log('from opengraphApi 13');
        console.log(results);
        res.json({'ogs': results});
    });
});

module.exports = route;