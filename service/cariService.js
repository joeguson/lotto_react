const akuService = require('./akuService');
const tandyaService = require('./tandyaService');
const penobrolService = require('./penobrolService');
let config = require('../config.json');
const jsForBack = require('../back/jsForBack.js');

exports.getRandArticle = async function() {
    const randArticle = await Promise.all([
        penobrolService.getRandPenobrol(),
        tandyaService.getRandTandya()
    ]);
    return randArticle;
};

exports.getSearch = async function(words, hashes) {
    const searchResult = await Promise.all([
        akuService.searchUser(words),
        penobrolService.searchPenobrol(words),
        tandyaService.searchTandya(words),
        penobrolService.searchPenobrolByHash(hashes),
        tandyaService.searchTandyaByHash(hashes)
    ]);
    return searchResult;
};

/* ===== local functions ===== */



