exports.dateMaker = function(date) {
    const tempDate = new Date(date);
    const nowDate = new Date();
    // const year = tempDate.getFullYear();
    const month = (tempDate.getMonth()) + 1;
    const day = tempDate.getDate();
    const diff = nowDate - tempDate;
    if(diff >=31536000000)
        return 'over a year ago';
    else if (diff > 864000000)
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

exports.flatten = function(list) {
    const flatArrayReducer = (acc, val) => {
        return acc.concat(val);
    };
    const flattenedData = list.reduce(flatArrayReducer, []);
    console.log('from serviceUtil');
    // console.log(flattenedData);
    return flattenedData;
};