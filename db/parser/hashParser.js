/*
 * Copyright (c) 2020. Created by Seung Joo Noh.
 * All rights reserved.
 */

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
