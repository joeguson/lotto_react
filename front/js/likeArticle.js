// /* ===== replyLike ===== */
// function replyLike(reply){
//     let __article = {
//         __like: #{topic.likeStatus},  // update value with __updateLikeState()
//         __likeCount: #{topic.likeCount}
//     };
//     document.getElementById("articleLikeButton").onclick = function () {
//         //버튼을 누르자마자 현재 __like를 기준으로 우선 그림과 숫자를 바꿔줌
//         var articleLikeNum = document.getElementById('articleLikeNum');
//         var imgTag = this.childNodes[0];
//         if(__article.__like){
//             articleLikeNum.innerHTML = parseInt(articleLikeNum.innerHTML)-1;
//             imgTag.src = location.origin +'/icons/cap.png';
//         }
//         else{
//             articleLikeNum.innerHTML = parseInt(articleLikeNum.innerHTML)+1;
//             imgTag.src = location.origin +'/icons/nocap.png';
//         }
//
//         //이후에 ajax 요청을 보냄
//         var type = window.location.href.split('/')[3];
//         var id = window.location.href.split('/')[4];
//         var data = {
//             "id": id,
//             "cancel": __article.__like
//         };
//         __article.__like = !__article.__like;
//         makeRequest('POST', 'api/article/' + type + '/like', data)
//             .then(function (e) {
//                 e = JSON.parse(e);
//                 console.log(e);
//             });
//     }
// }

//////////////////////Penobrol//////////////////////
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
