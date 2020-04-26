/*
 * Copyright (c) 2020. Created by Seung Joo Noh.
 * All rights reserved.
 */

const utils = require("../utils.js");

function parseReply(packet) {
    return {
        // common
        id: packet.id,
        author: packet.author,
        date: utils.dateMaker(packet.date),
        score: packet.score,
        changed_date: packet.changed_date,
        comments: packet.comments,
        u_id: packet.u_id
    };
}

exports.parsePenobrolComment = function (packet) {
    const penobrolComment = parseReply(packet);
    penobrolComment.p_id = packet.p_id;
    penobrolComment.content = packet.content;
    return penobrolComment;
};

exports.parseTandyaAnswer = function (packet) {
    const tandyaAnswer = parseReply(packet);
    tandyaAnswer.t_id = packet.t_id;
    tandyaAnswer.answer = packet.answer;
    return tandyaAnswer;
};

exports.parseYoutublogComment = function (packet) {
    const youtublogComment = parseReply(packet);
    youtublogComment.y_id = packet.y_id;
    youtublogComment.content = packet.content;
    return youtublogComment;
};

