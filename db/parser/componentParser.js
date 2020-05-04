/*
 * Copyright (c) 2020. Created by Seung Joo Noh.
 * All rights reserved.
 */

const utils = require("../utils.js");

/* ==== Article Like ==== */

function parseLikeCommon(packet){
    return {u_id: packet.u_id}
}

function parseHashCommon(packet){
    return {
        id: packet.id,
        hash: packet.hash
    }
}

exports.parsePLike = function (packet) {
    const tempLike = parseLikeCommon(packet);
    tempLike.p_id = packet.p_id;
    return tempLike;
};

exports.parseTLike = function (packet) {
    const tempLike = parseLikeCommon(packet);
    tempLike.t_id = packet.t_id;
    return tempLike;
};

exports.parseYLike = function (packet) {
    const tempLike = parseLikeCommon(packet);
    tempLike.y_id = packet.y_id;
    return tempLike;
};

/* ==== Reply Like ==== */

exports.parsePcLike = function (packet) {
    const tempLike = parseLikeCommon(packet);
    tempLike.pc_id = packet.pc_id;
    return tempLike;
};

exports.parseTaLike = function (packet) {
    const tempLike = parseLikeCommon(packet);
    tempLike.ta_id = packet.ta_id;
    return tempLike;
};

exports.parseYcLike = function (packet) {
    const tempLike = parseLikeCommon(packet);
    tempLike.yc_id = packet.yc_id;
    return tempLike;
};

/* ==== Reply Like ==== */

exports.parseHashtagP = function (packet) {
    const tempHash = parseHashCommon(packet);
    tempHash.p_id = packet.p_id;
    return tempHash;
};

exports.parseHashtagT = function (packet) {
    const tempHash = parseHashCommon(packet);
    tempHash.t_id = packet.t_id;
    return tempHash;
};

exports.parseHashtagY = function (packet) {
    const tempHash = parseHashCommon(packet);
    tempHash.y_id = packet.y_id;
    return tempHash;
};