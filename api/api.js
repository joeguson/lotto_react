//url - '/api'
const api = require('express').Router();
const tandyaRouter = require('./tandyaApi');
const penobrolRouter = require('./penobrolApi');

api.use('/tandya', tandyaRouter);
api.use('/penobrol', penobrolRouter);

module.exports = api;

