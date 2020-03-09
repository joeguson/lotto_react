//////////////////////Variables//////////////////////
let warnClick = true;

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
    if(original.warnedType === 'p') url = 'api/penobrol/warn';
    else if(original.warnedType === 't') url = 'api/tandya/warn';
    else url = 'api/youtublog/warn';
    if(confirmedValue == true){
        async function warn(url, data) {
            let ajaxResult = await makeRequest('post', url, data);
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
