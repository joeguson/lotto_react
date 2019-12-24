const utils = require("./utils.js");

function anonymouseMaker(username) {
    return username.substr(0, 3) + '****';
}

function parseArticle(packet) {
    return {
        // common
        id: packet.id,
        content: packet.content,
        author: packet.author,
        date: utils.dateMaker(packet.date), // reformat date
        identifier: packet.identifier,
        public: packet.public,
        warning: packet.warning,
        changed_date: packet.changed_date,
        score: packet.score,
        hashtags: packet.hashtags,
        likes: packet.likes,
        u_id: packet.u_id && packet.public !== 'p'? anonymouseMaker(packet.u_id) : packet.u_id
    };
}

exports.parsePenobrol = function (packet) {
    const penobrol = parseArticle(packet);
    penobrol.title = packet.title;
    penobrol.comments = packet.comments;
    penobrol.view = packet.p_view;
    return penobrol;
};

exports.parseTandya = function (packet) {
    const tandya = parseArticle(packet);
    tandya.question = packet.question;
    tandya.answers = packet.answers;
    tandya.view = packet.t_view;
    return tandya;
};

exports.parseHashtag = function (packet) {
    return {
        id: packet.id,
        p_id: packet.p_id,
        hash: packet.hash
    };
};

exports.parseComment = function (packet) {
    return {
        id: packet.id,
        p_id: packet.p_id,
        author: packet.author,
        content: packet.content,
        date: utils.dateMaker(packet.date),
        score: packet.score,
        changed_date: packet.changed_date,
        comments: packet.comments,
        likes: packet.likes,
        u_id: packet.u_id
    };
};

exports.parseCComment = function (packet) {
    return {
        id: packet.id,
        author: packet.author,
        content: packet.content,
        date: utils.dateMaker(packet.date),
        pc_id: packet.pc_id,
        u_id: packet.u_id
    };
};

exports.parseLike = function (packet) {
    return {
        like_id: packet.like_id,
        u_id: packet.u_id
    };
};

exports.parseCLike = function (packet) {
    return {
        id: packet.id,
        author: packet.author,
        content: packet.content,
        date: utils.dateMaker(packet.date),
        pc_id: packet.pc_id,
        u_id: packet.u_id
    };
};