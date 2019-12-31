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

exports.getImage = function(contentString){
    var id = 1;
    var imgIndex = 0;
    var imgMaps = {};
    while(true) {
        // <img
        imgIndex = contentString.indexOf('<img', imgIndex);
        if(imgIndex == -1) break;
        var endIndex = contentString.indexOf('>', imgIndex);
        endIndex++;
        const data = contentString.substring(imgIndex, endIndex);
        imgMaps[id] = data;
        id++;
        imgIndex = endIndex;
    }
    var temp = Object.values(imgMaps);
    if(temp.length > 0)
    {
        return temp;
    }
    else{
        return [];
    }
};
