const articleService = require('./articleService');
const hashService = require('./hashService');
const akuService = require('./akuService');
const jsForBack = require('../back/jsForBack.js');

exports.getRandArticle = async function() {
    const randArticle = await Promise.all([
        articleService.getRandFrontArticle('penobrol'),
        articleService.getRandFrontArticle('tandya'),
        articleService.getRandFrontArticle('youtublog'),
    ]);
    return randArticle;
};

exports.getSearch = async function(words, hashes) {
    const searchResult = await Promise.all([
        akuService.searchUser(words),
        articleService.searchArticle(words, 'penobrol'),
        articleService.searchArticle(words, 'tandya'),
        articleService.searchArticle(words, 'youtublog'),
        hashService.searchArticleByHash(hashes, 'penobrol'),
        hashService.searchArticleByHash(hashes, 'tandya'),
        hashService.searchArticleByHash(hashes, 'youtublog'),
    ]);
    return searchResult;
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



