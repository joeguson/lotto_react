const utils = require("./utils.js");

function anonymouseMaker(username) {
    return username.substring(0, 3) + '****';
}

function parseArticle(packet) {
    return {
        // common
        id: packet.id,
        content: packet.content,
        author: packet.author,
        thumbnail: packet.thumbnail,
        date: utils.dateMaker(packet.date), // reformat date
        public: packet.public,
        warning: packet.warning,
        changed_date: packet.changed_date,
        score: packet.score,
        hashtags: packet.hashtags,
        likes: packet.likes,
        u_id: packet.u_id && packet.public !== 'p'? anonymouseMaker(packet.u_id) : packet.u_id
    };
}

function parseFrontArticle(packet) {
    return {
        // common
        id: packet.id,
        date: utils.dateMaker(packet.date), // reformat date
        thumbnail: packet.thumbnail,
        u_id: packet.u_id && packet.public !== 'p'? anonymouseMaker(packet.u_id) : packet.u_id,
        hashtags: packet.hashtags,
        likes: packet.likes
    };
}

exports.parseFrontPenobrol = function (packet) {
    const penobrol = parseFrontArticle(packet);
    penobrol.title = packet.title;
    penobrol.commentCount = packet.comments;
    penobrol.view = packet.p_view;
    penobrol.identifier = 'p';
    penobrol.img = utils.getImage(packet.content);
    return penobrol;
};

exports.parseFrontTandya = function (packet) {
    const tandya = parseFrontArticle(packet);
    tandya.question = packet.question;
    tandya.answerCount = packet.answers;
    tandya.view = packet.t_view;
    tandya.identifier = 't';
    tandya.img = utils.getImage(packet.content);
    return tandya;
};

exports.parseFrontYoutublog = function (packet) {
    const youtublog = parseFrontArticle(packet);
    youtublog.title = packet.title;
    youtublog.commentCount = packet.comments;
    youtublog.view = packet.y_view;
    youtublog.identifier = 'y';
    youtublog.img = utils.getImage(packet.content);
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

exports.parseAnswer = function (packet) {
    return {
        id: packet.id,
        t_id: packet.t_id,
        author: packet.author,
        answer: packet.answer,
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

exports.parseAComment = function (packet) {
    return {
        id: packet.id,
        author: packet.author,
        content: packet.content,
        date: utils.dateMaker(packet.date),
        ta_id: packet.ta_id,
        u_id: packet.u_id
    };
};

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

exports.parseCLike = function (packet) {
    return {
        pc_id: packet.pc_id,
        u_id: packet.u_id
    };
};

exports.parseALike = function (packet) {
    return {
        ta_id: packet.ta_id,
        u_id: packet.u_id
    };
};
