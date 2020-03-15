// url - '/api/article
const route = require('express').Router();
const jsForBack = require('../back/jsForBack.js');

const penobrolService = require('../service/penobrolService.js');
const tandyaService = require('../service/tandyaService.js');
const youtublogService = require('../service/youtublogService.js');

const articleMainColumns = {
    penobrol: "title",
    tandya: "question",
    youtublog: "title"
};

const articlePostFunctions = {
    penobrol: penobrolService.postPenobrol,
    tandya: tandyaService.postTandya,
    youtublog: youtublogService.postYoutublog
};
route.post('/:type', (req, res) => {
    const type = req.params["type"];
    const postFunction = articlePostFunctions[type];
    const column = req.body[articleMainColumns[type]];

    if (postFunction == null)
        res.status(400).send("Wrong article type");
    else postFunction(
        req.session.id2,
        column,
        req.body.content,
        req.body.public,
        req.body.thumbnail,
        jsForBack.finalHashtagMaker(req.body.hashtag)
    ).then(id =>
        res.json({"id": id})
    ).catch(e => {
        console.error(e);
        res.status(500).send("Could not post article");
    });
});

module.exports = route;