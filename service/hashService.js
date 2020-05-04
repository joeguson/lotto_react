//articleServices
const articleService = require('./articleService');
//replyServices
const replyService = require('./replyService');
//hashtags
const phashDao = require('../db/b-dao/penDao/phashDao');
const thashDao = require('../db/b-dao/tanDao/thashDao');
const yhashDao = require('../db/b-dao/youDao/yhashDao');
//others
const componentParser = require('../db/parser/componentParser.js');

const getHashtagFunctions = {
    penobrol: phashDao.penobrolHashtagById,
    tandya: thashDao.tandyaHashtagById,
    youtublog: yhashDao.youtublogHashtagById
};
const hashtagParseFunctions = {
    penobrol: componentParser.parseHashtagP,
    tandya: componentParser.parseHashtagT,
    youtublog: componentParser.parseHashtagY
};

exports.getHash = async function(id, type){
    const hashResult = await getHashtagFunctions[type](id);
    const hash = hashResult.map(hashtagParseFunctions[type]);
    return hash;
};

const searchArticleByHashFunctions = {
    penobrol: phashDao.penobrolSearchByHash,
    tandya: thashDao.tandyaSearchByHash,
    youtublog: yhashDao.youtublogSearchByHash
};

exports.searchArticleByHash = async function (array, type) {
    let tempResult = [];
    for (let h of array) {
        (await searchArticleByHashFunctions[type]('%' + h + '%')).forEach(ele => tempResult.push(ele.id));
    }
    return await Promise.all(tempResult.map(item => articleService.getFrontArticleById(item, type)));
};