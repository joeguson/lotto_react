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
    var returnObj = {};
    //need img src and rotate info
    const imgIndex = contentString.indexOf('<img', 0);
    const srcIndex = contentString.indexOf('src="', imgIndex);
    const rotIndex = contentString.indexOf('class="', imgIndex);
    const endIndex = contentString.indexOf('"', srcIndex+5);
    const endIndex2 = contentString.indexOf('"', rotIndex+7);
    if(imgIndex == -1 || srcIndex == -1 || endIndex == -1) return null;

    returnObj.src = contentString.substring(srcIndex + 5, endIndex);
    returnObj.rotate = contentString.substring(rotIndex+7, endIndex2);
    returnObj.src = returnObj.src.substring(0, returnObj.src.indexOf('images/')+6)+ '/thumbnail'+returnObj.src.substring(returnObj.src.indexOf('images/')+6, endIndex);
    return returnObj;
};
