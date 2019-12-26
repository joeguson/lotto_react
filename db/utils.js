exports.dateMaker = function(date) {
    const tempDate = new Date(date);
    const nowDate = new Date();
    // const year = tempDate.getFullYear();
    const month = tempDate.getMonth();
    const day = tempDate.getDate();
    const diff = nowDate - tempDate;

    if (diff >= 864000000)
        return month + '-' + day;
    else if (diff > 86400000)
        return Math.round(diff/86400000) + ' days ago';
    else if (diff > 3600000)
        return Math.round(diff/3600000) + ' h ago';
    else if (diff > 60000)
        return Math.round(diff/60000) + ' min ago';
    else
        return Math.round(diff/1000) + ' sec ago';
};

exports.commentLikeChecker = function(likeObject, cId, userId){
    return likeObject.filter(e => (e.like_id === cId && e.u_id === userId)) > 0;
};
