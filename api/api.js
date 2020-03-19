//url - '/api'
const jsForBack = require('../back/jsForBack.js');
const api = require('express').Router();
const akuRouter = require('./akuApi');
const cariRouter = require('./cariApi');
const samusil = require('./samusilApi');
const article = require('./articleApi');
const image = require('./imageApi');
const opengraph = require('./opengraphApi');

api.use('/aku', akuRouter);
api.use('/cari', cariRouter);
api.use('/samusil', samusil);
api.use('/article', article);
api.use('/image', image);
api.use('/opengraph', opengraph);



module.exports = api;

