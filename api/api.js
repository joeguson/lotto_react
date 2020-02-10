//url - '/api'
const api = require('express').Router();
const tandyaRouter = require('./tandyaApi');
const penobrolRouter = require('./penobrolApi');

api.use('/tandya', tandyaRouter.route);
api.use('/penobrol', penobrolRouter.route);

module.exports = api;

