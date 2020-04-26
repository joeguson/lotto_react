/*
 * Copyright (c) 2020. Created by Seung Joo Noh.
 * All rights reserved.
 */

const utils = require("../utils.js");

/* ==== Article Like ==== */

exports.parsePLike = function (packet) {
    return {
        p_id: packet.p_id,
        u_id: packet.u_id
    };
};

exports.parseTLike = function (packet) {
    return {
        t_id: packet.t_id,
        u_id: packet.u_id
    };
};

exports.parseYLike = function (packet) {
    return {
        y_id: packet.y_id,
        u_id: packet.u_id
    };
};

/* ==== Reply Like ==== */

exports.parsePcLike = function (packet) {
    return {
        pc_id: packet.pc_id,
        u_id: packet.u_id
    };
};

exports.parseTaLike = function (packet) {
    return {
        ta_id: packet.ta_id,
        u_id: packet.u_id
    };
};

exports.parseYcLike = function (packet) {
    return {
        yc_id: packet.yc_id,
        u_id: packet.u_id
    };
};

/* ==== Reply Like ==== */

exports.parseHashtagP = function (packet) {
    return {
        id: packet.id,
        p_id: packet.p_id,
        hash: packet.hash
    };
};

exports.parseHashtagT = function (packet) {
    return {
        id: packet.id,
        t_id: packet.t_id,
        hash: packet.hash
    };
};

exports.parseHashtagY = function (packet) {
    return {
        id: packet.id,
        y_id: packet.y_id,
        hash: packet.hash
    };
};