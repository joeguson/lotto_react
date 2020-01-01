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

exports.parseFrontPenobrol = function (packet) {
    const penobrol = {};
    penobrol.id = packet.id;
    penobrol.date = utils.dateMaker(packet.date);
    penobrol.title = packet.title;
    penobrol.thumbnail = packet.thumbnail;
    penobrol.commentCount = packet.comments;
    penobrol.view = packet.p_view;
    penobrol.identifier = 'p';
    penobrol.hashtags = packet.hashtags;
    penobrol.u_id =  packet.u_id && packet.public !== 'p'? anonymouseMaker(packet.u_id) : packet.u_id;
    penobrol.img = utils.getImage(packet.content);
    console.log(penobrol.img);
    return penobrol;
};

exports.parseFrontTandya = function (packet) {
    const tandya = {};
    tandya.id = packet.id
    tandya.date = utils.dateMaker(packet.date);
    tandya.question = packet.question;
    tandya.thumbnail = packet.thumbnail;
    tandya.answerCount = packet.answers;
    tandya.view = packet.t_view;
    tandya.identifier = 't';
    tandya.hashtags = packet.hashtags;
    tandya.u_id =  packet.u_id && packet.public !== 'p'? anonymouseMaker(packet.u_id) : packet.u_id
    tandya.img = utils.getImage(packet.content);
    return tandya;
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

exports.parseALike = function (packet) {
    return {
        id: packet.id,
        author: packet.author,
        content: packet.content,
        date: utils.dateMaker(packet.date),
        ta_id: packet.ta_id,
        u_id: packet.u_id
    };
};
