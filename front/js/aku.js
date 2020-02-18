//////////////////////Variables//////////////////////
let followClick = true;

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
function follow(target) {
    console.log(target);
    let plikeNum = document.getElementById('plike');
    let data={
        "p_id" : penobrol.value.split('/')[0],
        "pc_id" : penobrol.value.split('/')[1],
        "clickVal" : penobrol.value.split('/')[2]
    };
    let url = 'api/aku/' + target;
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
        penobrol.value = data.p_id+'/'+data.pc_id+'/'+ajaxResult.button
        plikeNum.innerHTML = ajaxResult.p_like
        if(ajaxResult.button === 1){
            penobrol.childNodes[0].src = "./icons/nocap.png";
        }
        else{
            penobrol.childNodes[0].src = "./icons/cap.png";
        }
    }
}