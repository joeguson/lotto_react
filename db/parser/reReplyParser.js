/*
 * Copyright (c) 2020. Created by Seung Joo Noh.
 * All rights reserved.
 */

const utils = require("../utils.js");

function parseReReply(packet) {
    return {
        // common
        id: packet.id,
        author: packet.author,
        content: packet.content,
        date: utils.dateMaker(packet.date),
        u_id: packet.u_id
    };
}

exports.parsePenobrolCComment = function (packet) {
    const penobrolComCom = parseReReply(packet);
    penobrolComCom.pc_id = packet.pc_id;
    return penobrolComCom;
};

exports.parseTandyaAComment = function (packet) {
    const tandyaAnsCom = parseReReply(packet);
    tandyaAnsCom.ta_id = packet.ta_id;
    return tandyaAnsCom;
};

exports.parseYoutublogCComment = function (packet) {
    const youtublogComCom = parseReReply(packet);
    youtublogComCom.yc_id = packet.yc_id;
    return youtublogComCom;
};