//////////////////////Variables//////////////////////
var pWarnClick = true;
var tWarnClick = true;

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
//////////////////////Any Article//////////////////////
function warningArticle(warning){
    var url = '';
    var warningValue = warning.value.split("/");
    var confirmWarning = function(){
        return confirm("You cannot cancel warn. Are you sure to warn this?");
    };
    var confirmedValue = confirmWarning();
    var original = {'warnedType' : warningValue[0], "warnedItem" : warningValue[1], "warnedId" : warningValue[2]};
    if(original.warnedType == 'p'){
        url = '/pwarning/';
    }
    else{
        url = '/twarning/';
    }
    if(confirmedValue == true){
        async function warnPenobrol(url, data) {
            var ajaxResult = await makeRequest(url, data);
            var ajaxResult = JSON.parse(ajaxResult);
            if(ajaxResult.result == 1){
                alert('terima kasih');
            }
            else{
                alert('sudah di warn');
            }
        }
        if(pWarnClick){
            pWarnClick = !pWarnClick;
            warnPenobrol(url, original);
            setTimeout(function(){
                pWarnClick = true;
            },2000);
        }
    }
}
