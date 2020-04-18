/*
 * Copyright (c) 2020. Created by Seung Joo Noh.
 * All rights reserved.
 */

const utils = require("../utils.js");

exports.parsePenobrolCComment = function (packet) {
    return {
        id: packet.id,
        author: packet.author,
        content: packet.content,
        date: utils.dateMaker(packet.date),
        pc_id: packet.pc_id,
        u_id: packet.u_id
    };
};

exports.parseTandyaAComment = function (packet) {
    return {
        id: packet.id,
        author: packet.author,
        content: packet.content,
        date: utils.dateMaker(packet.date),
        ta_id: packet.ta_id,
        u_id: packet.u_id
    };
};

exports.parseYoutublogCComment = function (packet) {
    return {
        id: packet.id,
        author: packet.author,
        content: packet.content,
        date: utils.dateMaker(packet.date),
        yc_id: packet.yc_id,
        u_id: packet.u_id
    };
};