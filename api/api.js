//url - '/api'
const jsForBack = require('../back/jsForBack.js');
const api = require('express').Router();
const akuRouter = require('./akuApi');
const cariRouter = require('./cariApi');
const samusil = require('./samusilApi');
const article = require('./articleApi');
const youtube = require('./youtubeApi');

const config =require('../config.json');
const AWS = require('aws-sdk');
const s3 = new AWS.S3(config.aws_config);
const image = require('./imageApi');
const opengraph = require('./opengraphApi');

api.use('/aku', akuRouter);
api.use('/cari', cariRouter);
api.use('/samusil', samusil);
api.use('/article', article);
api.use('/image', image);
api.use('/opengraph', opengraph);
api.use('/youtube', youtube);


module.exports = api;

