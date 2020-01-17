//////////////////////Variables//////////////////////
var pLikeClick = true;
var tLikeClick = true;
var pcLikeClick = true;
var taLikeClick = true;

//////////////////////Ajax//////////////////////
function makeRequest(url, data) {
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
    var plikeNum = document.getElementById('plike');
    var data={
        "p_id" : penobrol.value.split('/')[0],
        "pc_id" : penobrol.value.split('/')[1],
        "clickVal" : penobrol.value.split('/')[2]
    }
    var url = '/plikes/'+penobrol.value.split('/')[0];
    if(pLikeClick){
        pLikeClick = !pLikeClick;
        likePenobrol(url, data);
        setTimeout(function(){
            pLikeClick = true;
        },2000);
    }
    async function likePenobrol(url, data) {
        // await code here
        var ajaxResult = await makeRequest(url, data);
        // code below here will only execute when await makeRequest() finished loading
        ajaxResult = JSON.parse(ajaxResult);
        penobrol.value = data.p_id+'/'+data.pc_id+'/'+ajaxResult.button
        plikeNum.innerHTML = ajaxResult.p_like
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
    var url = '/pCommentlikes/'+comment.value.split('/')[1];
    if(pcLikeClick){
        pcLikeClick = !pcLikeClick;
        likePcomment(url, data);
        setTimeout(function(){
            pcLikeClick = true;
        },2000);
    }
    async function likePcomment(url, data) {
        var ajaxResult = await makeRequest(url, data);
        ajaxResult = JSON.parse(ajaxResult);
        comment.value = data.p_id+'/'+data.pc_id+'/'+ajaxResult.button
        pclikeNum.innerHTML = ajaxResult.pc_like
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
    var tlikeNum = document.getElementById('tlike');
    var data={
        "t_id" : tandya.value.split('/')[0],
        "ta_id" : tandya.value.split('/')[1],
        "clickVal" : tandya.value.split('/')[2]
    }
    var url = '/tlikes/'+tandya.value.split('/')[0];
    if(tLikeClick){
        tLikeClick = !tLikeClick;
        likeTandya(url, data);
        setTimeout(function(){
            tLikeClick = true;
        },2000);
    }
    async function likeTandya(url, data) {
        var ajaxResult = await makeRequest(url, data);
        ajaxResult = JSON.parse(ajaxResult);
        tandya.value = data.t_id+'/'+data.ta_id+'/'+ajaxResult.button
        tlikeNum.innerHTML = ajaxResult.t_like
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
    var url = '/tAnswerlikes/'+answer.value.split('/')[0];
    if(taLikeClick){
        taLikeClick = !taLikeClick;
        likeTanswer(url, data);
        setTimeout(function(){
            taLikeClick = true;
        },2000);
    }
    async function likeTanswer(url, data) {
        var ajaxResult = await makeRequest(url, data);
        ajaxResult = JSON.parse(ajaxResult);
        answer.value = data.t_id+'/'+data.ta_id+'/'+ajaxResult.button
        talikeNum.innerHTML = ajaxResult.ta_like
        if(ajaxResult.button == 1){
            answer.childNodes[0].src = "./icons/nocap.png";
        }
        else{
            answer.childNodes[0].src = "./icons/cap.png";
        }
    }
}
