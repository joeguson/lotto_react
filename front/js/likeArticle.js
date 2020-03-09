//////////////////////Variables//////////////////////
let pLikeClick = true;
let tLikeClick = true;
let yLikeClick = true;
let pcLikeClick = true;
let taLikeClick = true;
let ycLikeClick = true;

//////////////////////Penobrol//////////////////////
function pLike(penobrol) {
    let articleLikeNum = document.getElementById('articleLikeNum');
    let data = getData(penobrol);
    let url = 'api/penobrol/like';
    if(pLikeClick){
        pLikeClick = !pLikeClick;
        likeResult(articleLikeNum, penobrol, url, data);
        setTimeout(function(){
            pLikeClick = true;
        },2000);
    }
}

function pcLike(comment) {
    let pclikeNum = document.getElementById('pCommentlikes'+comment.value.split('/')[1]);
    let data = getData(comment);
    let url = 'api/penobrol/like/comment/';
    if(pcLikeClick){
        pcLikeClick = !pcLikeClick;
        likeResult(pclikeNum, comment, url, data);
        setTimeout(function(){
            pcLikeClick = true;
        },2000);
    }
}

//////////////////////Tandya//////////////////////
function tLike(tandya){
    let articleLikeNum = document.getElementById('articleLikeNum');
    let data = getData(tandya);
    let url = 'api/tandya/like';
    if(tLikeClick){
        tLikeClick = !tLikeClick;
        likeResult(articleLikeNum, tandya, url, data);
        setTimeout(function(){
            tLikeClick = true;
        },2000);
    }
}

function taLike(answer){
    let talikeNum = document.getElementById('tAnswerlikes'+answer.value.split('/')[1]);
    let data = getData(answer);
    let url = 'api/tandya/like/answer/';
    if(taLikeClick){
        taLikeClick = !taLikeClick;
        likeResult(talikeNum, answer, url, data);
        setTimeout(function(){
            taLikeClick = true;
        },2000);
    }
}

//////////////////////Youtublog//////////////////////
function yLike(youtublog) {
    let articleLikeNum = document.getElementById('articleLikeNum');
    let data = getData(youtublog);
    let url = 'api/youtublog/like';
    if(yLikeClick){
        yLikeClick = !yLikeClick;
        likeResult(articleLikeNum, youtublog, url, data);
        setTimeout(function(){
            yLikeClick = true;
        },2000);
    }
}

function ycLike(comment) {
    let yclikeNum = document.getElementById('yCommentlikes'+comment.value.split('/')[1]);
    let data = getData(comment);
    let url = 'api/youtublog/like/comment/';
    if(ycLikeClick){
        ycLikeClick = !ycLikeClick;
        likeResult(yclikeNum, comment, url, data);
        setTimeout(function(){
            ycLikeClick = true;
        },2000);
    }
}

function getData(target){
    let temp = {
        "articleId" : target.value.split('/')[0],
        "comAnsId" : target.value.split('/')[1],
        "clickVal" : target.value.split('/')[2]
    }
    return temp;
}

async function likeResult(likeNum, target, url, data){
    let ajaxResult = await makeRequest('post', url, data);
    ajaxResult = JSON.parse(ajaxResult);
    target.value = data.articleId+'/'+data.comAnsId+'/'+ajaxResult.button;
    likeNum.innerHTML = ajaxResult.result;
    if(ajaxResult.button == 1) target.childNodes[0].src = "./icons/nocap.png";
    else target.childNodes[0].src = "./icons/cap.png";
}
