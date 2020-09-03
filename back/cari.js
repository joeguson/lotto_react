//url - '/cari'
const route = require('express').Router();
const service = require('../service/serviceUtil');

route.get('/', function (req, res) {
    res.render('./layout');
});

module.exports = route;