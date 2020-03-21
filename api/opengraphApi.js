//url - '/api/opengraph'
const route = require('express').Router();
const jsForBack = require('../back/jsForBack.js');
const ogs = require('open-graph-scraper');

/* ===== samusil ===== */

route.post('/', (req, res) => {
    let urlSource = req.body.urlSource;
    let options = {'url': urlSource, 'encoding': 'utf8'};
    ogs(options, function (error, results) {
        res.json({'ogs': results});
    });
});

module.exports = route;