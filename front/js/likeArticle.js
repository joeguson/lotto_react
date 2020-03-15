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
    let url = 'api/article/penobrol/like';
    likeResult(articleLikeNum, penobrol, url, data);
    if(data.clickVal) penobrol.childNodes[0].src = "./icons/nocap.png";
    else penobrol.childNodes[0].src = "./icons/cap.png";
    penobrol.value = data.articleId+'/'+data.comAnsId+'/'+(data.clickVal ? 0 : 1);
}

function pcLike(comment) {
    let pclikeNum = document.getElementById('pCommentlikes'+comment.value.split('/')[1]);
    let data = getData(comment);
    let url = 'api/article/penobrol/reply/like';
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
    let url = 'api/article/tandya/like';
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
    let url = 'api/article/tandya/reply/like';
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
    let url = 'api/article/youtublog/like';
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
    let url = 'api/article/youtublog/reply/like';
    if(ycLikeClick){
        ycLikeClick = !ycLikeClick;
        likeResult(yclikeNum, comment, url, data);
        setTimeout(function(){
            ycLikeClick = true;
        },2000);
    }
}

function getData(target){
    return {
        "articleId": target.value.split('/')[0],
        "comAnsId": target.value.split('/')[1],
        "clickVal": target.value.split('/')[2]
    };
}

async function likeResult(likeNum, target, url, data){
    let ajaxResult = await makeRequest('post', url, data);
    ajaxResult = JSON.parse(ajaxResult);
    if(ajaxResult.button != null) target.value = data.articleId+'/'+data.comAnsId+'/'+ajaxResult.button;
    likeNum.innerHTML = ajaxResult.result;
}
