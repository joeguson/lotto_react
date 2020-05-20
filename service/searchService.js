//user
const userDao = require('../db/b-dao/userDao/userDao');
//article
const penobrolDao = require('../db/b-dao/penDao/penobrolDao');
const tandyaDao = require('../db/b-dao/tanDao/tandyaDao');
const youtublogDao = require('../db/b-dao/youDao/youtublogDao');
//hashtags
const phashDao = require('../db/b-dao/penDao/phashDao');
const thashDao = require('../db/b-dao/tanDao/thashDao');
const yhashDao = require('../db/b-dao/youDao/yhashDao');

const articleService = require('./articleService');
const serviceUtil = require('./serviceUtil');

exports.determineSearch = async function(type, words, hashes){
    let result = {};
    if(type === 'cari'){
        const [user, penobrol, tandya, youtublog, phash, thash, yhash] = await Promise.all([
            __searchUser(words, type),
            __searchArticle(words, 'penobrol'),
            __searchArticle(words, 'tandya'),
            __searchArticle(words, 'youtublog'),
            __searchArticleByHash(hashes, 'penobrol'),
            __searchArticleByHash(hashes, 'tandya'),
            __searchArticleByHash(hashes, 'youtublog'),
        ]);
        let article = penobrol.concat(tandya);
        article = article.concat(youtublog);

        let hashtag = phash.concat(thash);
        hashtag = hashtag.concat(yhash);

        result.user = user;
        result.article = article;
        result.hashtag = hashtag;
    }
    else{
        const [user, article, hashtag] = await Promise.all([
            __searchUser(words, type),
            __searchArticle(words, type),
            __searchArticleByHash(hashes, type),
        ]);
        result.user = user;
        result.article = article;
        result.hashtag = hashtag;
    }
    return result;
};

async function __searchUser(string) {
    const results = await userDao.userSearch(string);
    return results[0];
};

const searchArticleFunctions = {
    penobrol: penobrolDao.penobrolSearch,
    tandya: tandyaDao.tandyaSearch,
    youtublog: youtublogDao.youtublogSearch
};

async function __searchArticle(string, type){
    const results = await searchArticleFunctions[type](string);
    return await serviceUtil.__articleFrontParseSupplement(results, type);
}

const searchArticleByHashFunctions = {
    penobrol: phashDao.penobrolSearchByHash,
    tandya: thashDao.tandyaSearchByHash,
    youtublog: yhashDao.youtublogSearchByHash
};

async function __searchArticleByHash(array, type) {
    let tempResult = [];
    for (let h of array) {
        (await searchArticleByHashFunctions[type]('%' + h + '%')).forEach(ele => tempResult.push(ele.id));
    }
    return await Promise.all(tempResult.map(item => articleService.getFrontArticleById(item, type)));
};

/* ===== export functions ===== */
exports.searchArticleByHash = async function (array, type) {
    return __searchArticleByHash(array, type);
};

exports.searchArticle = async function (string, type) {
    return __searchArticle(string, type);
};

exports.searchUser = async function(string) {
    return __searchUser(string);
};
