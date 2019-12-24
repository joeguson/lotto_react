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
        return (diff / 86400000).toString() + ' days ago';
    else if (diff > 3600000)
        return (diff / 3600000).toString() + ' h ago';
    else if (diff > 60000)
        return (diff / 60000).toString() + ' min ago';
    else
        return (diff / 1000).toString() + ' sec ago';
};

exports.commentLikeChecker = function(likeObject, cId, userId){
    return likeObject.filter(e => (e.like_id === cId && e.u_id === userId)) > 0;
};