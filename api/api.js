//url - '/api'
const api = require('express').Router();
const tandyaRouter = require('./tandyaApi');
const penobrolRouter = require('./penobrolApi');
const akuRouter = require('./akuApi');
const cariRouter = require('./cariApi');

api.use('/aku', akuRouter);
api.use('/cari', cariRouter);
api.use('/tandya', tandyaRouter);
api.use('/penobrol', penobrolRouter);

module.exports = api;

