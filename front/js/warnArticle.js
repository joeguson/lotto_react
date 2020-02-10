//////////////////////Variables//////////////////////
var warnClick = true;

//////////////////////Ajax//////////////////////
function makeWarnRequest(url, data) {
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
//////////////////////Any Article//////////////////////
function warningArticle(warning){
    let url = '';
    const warningValue = warning.value.split("/");
    let confirmWarning = function(){
        return confirm("You cannot cancel warn. Are you sure to warn this?");
    };
    let confirmedValue = confirmWarning();
    let original = {
        'warnedType' : warningValue[0],
        "warnedItem" : warningValue[1],
        "warnedId" : warningValue[2]
    };
    if(original.warnedType == 'p'){
        url = 'api/penobrol/warn';
    }
    else{
        url = 'api/tandya/warn';
    }
    if(confirmedValue == true){
        async function warn(url, data) {
            let ajaxResult = await makeWarnRequest(url, data);
            ajaxResult = JSON.parse(ajaxResult);
            if(ajaxResult.result == 1){
                alert('terima kasih');
            }
            else{
                alert('sudah di warn');
            }
        }
        if(warnClick){
            warnClick = !warnClick;
            warn(url, original);
            setTimeout(function(){
                warnClick = true;
            },2000);
        }
    }
}
