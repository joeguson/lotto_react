
////////////////{type}/warn////////////////
//////////////////article//////////////////
function warnPenobrol(warned_id) {
    let data = {warned_id: warned_id};
    const url = '/api/article/penobrol/warn';
    makeRequest('POST', url, data)
        .then(res => {
            alert("Success warning this pcontents");
        }).catch(res => {
        alert("You already warn this pcontents");
    })
}

function warnTandya(warned_id) {
    let data = {warned_id: warned_id};
    const url = '/api/article/tandya/warn';
    makeRequest('POST', url, data)
        .then(res => {
            alert("Success warning this tcontents");
        }).catch(res => {
        alert("You already warn this tcontents");
    })
}

function warnYoutublog(warned_id) {
    let data = {warned_id: warned_id};
    const url = '/api/article/youtublog/warn';
    makeRequest('POST', url, data)
        .then(res => {
            alert("Success warning this ycontents");
        }).catch(res => {
        alert("You already warn this ycontents");
    })
}

///////////////{type}/reply/warn///////////////
////////////////////reply////////////////////
function warnPenobrolCom(warned_id) {
    let data = {warned_id: warned_id};
    const url = '/api/article/penobrol/reply/warn';
    makeRequest('POST', url, data)
        .then(res => {
            alert("Success warning this pc-contents");
        }).catch(res => {
        alert("You already warn this pc-contents");
    })
}

function warnTandyaAns(warned_id) {
    let data = {warned_id: warned_id};
    const url = '/api/article/tandya/reply/warn';
    makeRequest('POST', url, data)
        .then(res => {
            alert("Success warning this ta-contents");
        }).catch(res => {
        alert("You already warn this ta-contents");
    })
}

function warnYoutublogCom(warned_id) {
    let data = {warned_id: warned_id};
    const url = '/api/article/youtublog/reply/warn';
    makeRequest('POST', url, data)
        .then(res => {
            alert("Success warning this yc-contents");
        }).catch(res => {
        alert("You already warn this yc-contents");
    })
}

///////////////{type}/re-reply/warn///////////////
////////////////////re-reply////////////////////
function warnPenobrolComCom(warned_id) {
    let data = {warned_id: warned_id};
    const url = '/api/article/penobrol/re-reply/warn';
    makeRequest('POST', url, data)
        .then(res => {
            alert("Success warning this pcc-contents");
        }).catch(res => {
        alert("You already warn this pcc-contents");
    })
}

function warnTandyaAnsCom(warned_id) {
    let data = {warned_id: warned_id};
    const url = '/api/article/tandya/re-reply/warn';
    makeRequest('POST', url, data)
        .then(res => {
            alert("Success warning this tac-contents");
        }).catch(res => {
        alert("You already warn this tac-contents");
    })
}

function warnYoutublogComCom(warned_id) {
    let data = {warned_id: warned_id};
    const url = '/api/article/youtublog/re-reply/warn';
    makeRequest('POST', url, data)
        .then(res => {
            alert("Success warning this ycc-contents");
        }).catch(res => {
        alert("You already warn this ycc-contents");
    })
}