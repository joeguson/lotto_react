/*
 * Copyright (c) 2020. Created by Hyun I Kim.
 * All rights reserved.
 */

// url = '/api/youtube'
const route = require('express').Router();
const youtubeService = require('../service/youtublogService.js');

route.post('/', (req, res) => {
    const source = req.body.source;
    youtubeService.newYoutube(source).then(id => res.json(id));
});

route.post('/time-row', (req, res) => {
    const sourceId = req.body.sourceId;
    const timeRows = req.body.timeRows;
    youtubeService.newYoutubeTimeRows(sourceId, timeRows).then(() =>
        res.status(201).send()
    ).catch(e => {
        if (e.sqlState === 23000) {
            res.status(409).send('Time row already exists for that time');
        } else {
            console.error(e);
            res.status(500).send();
        }
    });
});

route.get('/:id', (req, res) => {
    const youtubeId = req.params.id;
    youtubeService.getYoutubeById(youtubeId)
        .then(youtube => {
            if (youtube == null) res.status(404).send('Youtube source not found.');
            else res.json(youtube);
        });
});

module.exports = route;
