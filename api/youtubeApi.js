/*
 * Copyright (c) 2020. Created by Hyun I Kim.
 * All rights reserved.
 */

// url = '/api/youtube'
const route = require('express').Router();
const youtubeService = require('../service/youtublogService.js');

route.post('/', (req, res) => {
    const source = req.body.source;

    if (source == null) res.status(400).send();
    else youtubeService.newYoutube(source)
        .then(id => res.json(id));
});

route.delete('/', (req, res) => {
    const youtubeId = req.body.id;

    if (youtubeId == null) res.status(400).send('No id given');
    else youtubeService.deleteYoutube(youtubeId)
        .then(count => {
            if (count) res.status(200).send();
            else res.status(404).send();
        });
});

route.post('/time-row', (req, res) => {
    const sourceId = req.body.sourceId;
    const timeRows = req.body.timeRows;

    if (sourceId == null || timeRows == null) res.status(400).send('No sourceId or timeRows given');
    else youtubeService.newYoutubeTimeRows(sourceId, timeRows).then(() =>
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

    if (youtubeId == null) res.status(400).send('No youtubeId given');
    else youtubeService.getYoutubeById(youtubeId)
        .then(youtube => {
            if (youtube == null) res.status(404).send('Youtube source not found.');
            else res.json(youtube);
        });
});

module.exports = route;
