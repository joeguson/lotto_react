//////////////////////Ajax//////////////////////
function makeRequest(method, url, data) {
    return new Promise(function (resolve, reject) {
        var original = JSON.stringify(data);
        var xhr = new XMLHttpRequest();
        xhr.open(method, url);
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
    var data = {
        "p_id": penobrol.value.split('/')[0],
        "pc_id": penobrol.value.split('/')[1],
        "clickVal": penobrol.value.split('/')[2]
    }
    var url = 'api/penobrol/like';
    if (pLikeClick) {
        pLikeClick = !pLikeClick;
        likePenobrol(url, data);
        setTimeout(function () {
            pLikeClick = true;
        }, 2000);
    }

    async function likePenobrol(url, data) {
        // await code here
        var ajaxResult = await makeRequest('post', url, data);
        // code below here will only execute when await makeLikeRequest() finished loading
        ajaxResult = JSON.parse(ajaxResult);
        penobrol.value = data.p_id + '/' + data.pc_id + '/' + ajaxResult.button;
        articleLikeNum.innerHTML = ajaxResult.p_like;
        if (ajaxResult.button == 1) {
            penobrol.childNodes[0].src = "./icons/nocap.png";
        } else {
            penobrol.childNodes[0].src = "./icons/cap.png";
        }
    }
}

// var countp = document.getElementById('count');
//
// var countsec = 10;
// var timer = setInterval(myTimer, 1000);
// function myTimer(){
//     if(countsec === 0){
//         countsec=10;
//     }
//     countsec -= 1;
//     countp.innerHTML = countsec;
// }
//
// function sendAjax(url){
//     var xhr = new XMLHttpRequest();
//     xhr.open('post', url);
//     xhr.setRequestHeader('Content-type', "application/json");
//     // 데이터 수신이 완료되면 표시
//     xhr.addEventListener('load', function(){
//         var result = JSON.parse(xhr.responseText);
//         if(result.result !== 'ok') return;
//         // 데이터가 있으면 결과값 표시
//     });
// }
