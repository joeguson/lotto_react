//url - '/api'
const api = require('express').Router();
const tandyaRouter = require('./tandyaApi');
const penobrolRouter = require('./penobrolApi');
const youtublogRouter = require('./youtublogApi');
const akuRouter = require('./akuApi');
const cariRouter = require('./cariApi');

api.use('/aku', akuRouter);
api.use('/cari', cariRouter);
api.use('/tandya', tandyaRouter);
api.use('/penobrol', penobrolRouter);
api.use('/youtublog', youtublogRouter);

module.exports = api;

