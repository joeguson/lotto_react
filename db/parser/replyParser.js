/*
 * Copyright (c) 2020. Created by Seung Joo Noh.
 * All rights reserved.
 */

const utils = require("../utils.js");

exports.parsePenobrolComment = function (packet) {
    return {
        id: packet.id,
        p_id: packet.p_id,
        author: packet.author,
        content: packet.content,
        date: utils.dateMaker(packet.date),
        score: packet.score,
        changed_date: packet.changed_date,
        comments: packet.comments,
        u_id: packet.u_id
    };
};

exports.parseTandyaAnswer = function (packet) {
    return {
        id: packet.id,
        t_id: packet.t_id,
        author: packet.author,
        answer: packet.answer,
        date: utils.dateMaker(packet.date),
        score: packet.score,
        changed_date: packet.changed_date,
        comments: packet.comments,
        u_id: packet.u_id
    };
};

exports.parseYoutublogComment = function (packet) {
    return {
        id: packet.id,
        y_id: packet.y_id,
        author: packet.author,
        content: packet.content,
        date: utils.dateMaker(packet.date),
        score: packet.score,
        changed_date: packet.changed_date,
        comments: packet.comments,
        u_id: packet.u_id
    };
};

