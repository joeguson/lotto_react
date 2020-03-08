//url - '/api'
const api = require('express').Router();
const akuRouter = require('./akuApi');
const cariRouter = require('./cariApi');
const penobrolRouter = require('./penobrolApi');
const tandyaRouter = require('./tandyaApi');
const youtublogRouter = require('./youtublogApi');
const samusil = require('./samusilApi');

api.use('/aku', akuRouter);
api.use('/cari', cariRouter);
api.use('/penobrol', penobrolRouter);
api.use('/tandya', tandyaRouter);
api.use('/youtublog', youtublogRouter);
api.use('/samusil', samusil);

module.exports = api;

