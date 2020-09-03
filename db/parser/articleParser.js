/*
 * Copyright (c) 2020. Created by Seung Joo Noh.
 * All rights reserved.
 */

function anonymouseMaker(username) {
    return username.substring(0, 3) + '****';
}

function parseCommon(packet){
    return {
        id: packet.id,
        date: utils.dateMaker(packet.date), // reformat date
        thumbnail: packet.thumbnail,
        u_id: packet.u_id && packet.public !== 'p'? anonymouseMaker(packet.u_id) : packet.u_id,
        chosen: (packet.chosen === null) ? 0 : packet.chosen,
        hashtags: packet.hashtags
    }
}

function parseArticle(packet) {
    const temp = parseCommon(packet);
    temp.content = packet.content;
    temp.author = packet.author;
    temp.author = packet.author;
    temp.public = packet.public;
    temp.warning = packet.warning;
    temp.changed_date = packet.changed_date;
    temp.score = packet.score;
    return temp;
}

function parseFrontArticle(packet) {
    const temp = parseCommon(packet);
    temp.img = utils.getImage(packet.content);
    return temp;
}

exports.parseFrontPenobrol = function (packet) {
    const penobrol = parseFrontArticle(packet);
    penobrol.title = packet.title;
    penobrol.view = packet.p_view;
    penobrol.identifier = 'p';
    return penobrol;
};

exports.parseFrontTandya = function (packet) {
    const tandya = parseFrontArticle(packet);
    tandya.question = packet.question;
    tandya.view = packet.t_view;
    tandya.identifier = 't';
    return tandya;
};

exports.parseFrontYoutublog = function (packet) {
    const youtublog = parseFrontArticle(packet);
    youtublog.title = packet.title;
    youtublog.view = packet.y_view;
    youtublog.identifier = 'y';
    return youtublog;
};

exports.parsePenobrol = function (packet) {
    const penobrol = parseArticle(packet);
    penobrol.title = packet.title;
    penobrol.comments = packet.comments;
    penobrol.view = packet.p_view;
    penobrol.identifier = 'p';
    return penobrol;
};

exports.parseTandya = function (packet) {
    const tandya = parseArticle(packet);
    tandya.question = packet.question;
    tandya.answers = packet.answers;
    tandya.view = packet.t_view;
    tandya.identifier = 't';
    return tandya;
};

exports.parseYoutublog = function (packet) {
    const youtublog = parseArticle(packet);
    youtublog.title = packet.title;
    youtublog.comments = packet.comments;
    youtublog.view = packet.y_view;
    youtublog.identifier = 'y';
    return youtublog;
};

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