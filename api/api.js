//url - '/api'
const api = require('express').Router();
const akuRouter = require('./akuApi');
const cariRouter = require('./cariApi');
const samusil = require('./samusilApi');
const article = require('./articleApi');
const reply = require('./replyApi');
const rereply = require('./rereplyApi');
const youtube = require('./youtubeApi');
const image = require('./imageApi');
const opengraph = require('./opengraphApi');

api.use('/aku', akuRouter);
api.use('/cari', cariRouter);
api.use('/samusil', samusil);
api.use('/article', article);
api.use('/reply', reply);
api.use('/rereply', rereply);
api.use('/image', image);
api.use('/opengraph', opengraph);
api.use('/youtube', youtube);

module.exports = api;

