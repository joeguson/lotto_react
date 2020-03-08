//////////////////////Variables//////////////////////
let pLikeClick = true;
let tLikeClick = true;
let yLikeClick = true;
let pcLikeClick = true;
let taLikeClick = true;
let ycLikeClick = true;

//////////////////////Ajax//////////////////////
function makeLikeRequest(url, data) {
    return new Promise(function (resolve, reject) {
        var original = JSON.stringify(data);
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.setRequestHeader('Content-type', "application/json");
        xhr.send(original);
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
    });
}

//////////////////////Penobrol//////////////////////
function pLike(penobrol) {
    var articleLikeNum = document.getElementById('articleLikeNum');
    var data={
        "p_id" : penobrol.value.split('/')[0],
        "pc_id" : penobrol.value.split('/')[1],
        "clickVal" : penobrol.value.split('/')[2]
    }
    var url = 'api/penobrol/like';
    if(pLikeClick){
        pLikeClick = !pLikeClick;
        likePenobrol(url, data);
        setTimeout(function(){
            pLikeClick = true;
        },2000);
    }
    async function likePenobrol(url, data) {
        // await code here
        var ajaxResult = await makeLikeRequest(url, data);
        // code below here will only execute when await makeLikeRequest() finished loading
        ajaxResult = JSON.parse(ajaxResult);
        penobrol.value = data.p_id+'/'+data.pc_id+'/'+ajaxResult.button;
        articleLikeNum.innerHTML = ajaxResult.p_like;
        if(ajaxResult.button == 1){
            penobrol.childNodes[0].src = "./icons/nocap.png";
        }
        else{
            penobrol.childNodes[0].src = "./icons/cap.png";
        }
    }
}

function pcLike(comment) {
    var pclikeNum = document.getElementById('pCommentlikes'+comment.value.split('/')[1]);
    var data={
        "p_id" : comment.value.split('/')[0],
        "pc_id" : comment.value.split('/')[1],
        "clickVal" : comment.value.split('/')[2]
    }
    var url = 'api/penobrol/like/comment/';
    if(pcLikeClick){
        pcLikeClick = !pcLikeClick;
        likePcomment(url, data);
        setTimeout(function(){
            pcLikeClick = true;
        },2000);
    }
    async function likePcomment(url, data) {
        var ajaxResult = await makeLikeRequest(url, data);
        ajaxResult = JSON.parse(ajaxResult);
        comment.value = data.p_id+'/'+data.pc_id+'/'+ajaxResult.button;
        pclikeNum.innerHTML = ajaxResult.pc_like;
        if(ajaxResult.button == 1){
            comment.childNodes[0].src = "./icons/nocap.png";
        }
        else{
            comment.childNodes[0].src = "./icons/cap.png";
        }
    }
}

//////////////////////Tandya//////////////////////
function tLike(tandya){
    var articleLikeNum = document.getElementById('articleLikeNum');
    var data={
        "t_id" : tandya.value.split('/')[0],
        "ta_id" : tandya.value.split('/')[1],
        "clickVal" : tandya.value.split('/')[2]
    }
    var url = 'api/tandya/like';
    if(tLikeClick){
        tLikeClick = !tLikeClick;
        likeTandya(url, data);
        setTimeout(function(){
            tLikeClick = true;
        },2000);
    }
    async function likeTandya(url, data) {
        var ajaxResult = await makeLikeRequest(url, data);
        ajaxResult = JSON.parse(ajaxResult);
        tandya.value = data.t_id+'/'+data.ta_id+'/'+ajaxResult.button;
        articleLikeNum.innerHTML = ajaxResult.t_like;
        if(ajaxResult.button == 1){
            tandya.childNodes[0].src = "./icons/nocap.png";
        }
        else{
            tandya.childNodes[0].src = "./icons/cap.png";
        }
    }
}

function taLike(answer){
    var talikeNum = document.getElementById('tAnswerlikes'+answer.value.split('/')[1]);
    var data={
        "t_id" : answer.value.split('/')[0],
        "ta_id" : answer.value.split('/')[1],
        "clickVal" : answer.value.split('/')[2]
    }
    var url = 'api/tandya/like/answer/';
    if(taLikeClick){
        taLikeClick = !taLikeClick;
        likeTanswer(url, data);
        setTimeout(function(){
            taLikeClick = true;
        },2000);
    }
    async function likeTanswer(url, data) {
        var ajaxResult = await makeLikeRequest(url, data);
        ajaxResult = JSON.parse(ajaxResult);
        answer.value = data.t_id+'/'+data.ta_id+'/'+ajaxResult.button;
        talikeNum.innerHTML = ajaxResult.ta_like;
        if(ajaxResult.button == 1){
            answer.childNodes[0].src = "./icons/nocap.png";
        }
        else{
            answer.childNodes[0].src = "./icons/cap.png";
        }
    }
}

//////////////////////Youtublog//////////////////////
function yLike(youtublog) {
    let articleLikeNum = document.getElementById('articleLikeNum');
    var data={
        "y_id" : youtublog.value.split('/')[0],
        "yc_id" : youtublog.value.split('/')[1],
        "clickVal" : youtublog.value.split('/')[2]
    }
    var url = 'api/youtublog/like';
    if(yLikeClick){
        yLikeClick = !yLikeClick;
        likeYoutublog(url, data);
        setTimeout(function(){
            yLikeClick = true;
        },2000);
    }
    async function likeYoutublog(url, data) {
        // await code here
        var ajaxResult = await makeLikeRequest(url, data);
        // code below here will only execute when await makeLikeRequest() finished loading
        ajaxResult = JSON.parse(ajaxResult);
        youtublog.value = data.y_id+'/'+data.yc_id+'/'+ajaxResult.button;
        articleLikeNum.innerHTML = ajaxResult.y_like;
        if(ajaxResult.button == 1){
            youtublog.childNodes[0].src = "./icons/nocap.png";
        }
        else{
            youtublog.childNodes[0].src = "./icons/cap.png";
        }
    }
}

function ycLike(comment) {
    var yclikeNum = document.getElementById('yCommentlikes'+comment.value.split('/')[1]);
    var data={
        "y_id" : comment.value.split('/')[0],
        "yc_id" : comment.value.split('/')[1],
        "clickVal" : comment.value.split('/')[2]
    }
    var url = 'api/youtublog/like/comment/';
    if(ycLikeClick){
        ycLikeClick = !ycLikeClick;
        likeYcomment(url, data);
        setTimeout(function(){
            ycLikeClick = true;
        },2000);
    }
    async function likeYcomment(url, data) {
        var ajaxResult = await makeLikeRequest(url, data);
        ajaxResult = JSON.parse(ajaxResult);
        comment.value = data.y_id+'/'+data.yc_id+'/'+ajaxResult.button;
        yclikeNum.innerHTML = ajaxResult.yc_like;
        if(ajaxResult.button == 1){
            comment.childNodes[0].src = "./icons/nocap.png";
        }
        else{
            comment.childNodes[0].src = "./icons/cap.png";
        }
    }
}
