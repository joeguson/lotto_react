//url - '/search'
const route = require('express').Router();
const jsForBack = require('./jsForBack.js');
const searchService = require('../service/searchService.js');

route.get('/:type', function (req, res) {
    let rawCariString = req.query.s.split(' ');
    let wordOnly = jsForBack.getWordOnly(rawCariString);
    let hashOnly = jsForBack.getHashOnly(rawCariString);
    let type = req.params.type;
    searchService.determineSearch(type, wordOnly, hashOnly)
        .then((result) =>{
            res.render('./jc/cari-result', {
                search_string: req.query.s,
                user: result.user,
                article: result.article,
                hashtag: result.hashtag,
                u_id: req.session.u_id,
                id2: req.session.id2 ? req.session.id2 : 0
            });
        })
        .catch(() => {
            res.redirect('/cari');
        })
});

route.get('/', function (req, res) {
    res.redirect('/cari');
});

module.exports = route;