//////////////////////Variables//////////////////////
let warnClick = true;

//////////////////////Any Article//////////////////////
function warningArticle(warning){
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

    let url = 'api/article/';
    switch (original.warnedType) {
        case 'p': url += 'penobrol/'; break;
        case 't': url += 'tandya/'; break;
        case 'y': url += 'youtublog/'; break;
        default: return;
    }
    url += 'warn';

    if(confirmedValue){
        if(warnClick){
            warnClick = !warnClick;

            makeRequest('POST', url, original)
                .then(res => {
                    const result = JSON.parse(res.toString());
                    if (result.result) alert('terima kasih');
                    else alert('sudah di warn');
                });

            setTimeout(function(){
                warnClick = true;
            },2000);
        }
    }
}
