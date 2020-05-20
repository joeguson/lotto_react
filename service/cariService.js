const articleService = require('./articleService');
const hashService = require('./hashService');
const jsForBack = require('../back/jsForBack.js');

exports.getRandArticle = async function() {
    const randArticle = await Promise.all([
        articleService.getRandFrontArticle('penobrol'),
        articleService.getRandFrontArticle('tandya'),
        articleService.getRandFrontArticle('youtublog'),
    ]);
    return randArticle;
};

exports.getCariArticle = async function() {
    const randArticle = await Promise.all([
        articleService.getCariFrontArticle('penobrol'),
        articleService.getCariFrontArticle('tandya'),
        articleService.getCariFrontArticle('youtublog'),
    ]);
    return randArticle;
};

/* ===== local functions ===== */



