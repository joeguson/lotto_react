function warningAjax(warning){
    var warningValue = warning.value.split("/");
    var confirmWarning = function(){
        return confirm("You cannot cancel warn. Are you sure to warn this?");
    };
    var confirmedValue = confirmWarning();
    var original = {'warnedItem' : warningValue[0], "warnedP" : warningValue[1], "warnedC" : warningValue[2], "warnedCc" : warningValue[3]};
    original = JSON.stringify(original);
    if(confirmedValue == true){
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/pwarning/');
        xhr.setRequestHeader('Content-type', "application/json");
        xhr.send(original);
        // 데이터 수신이 완료되면 표시
        xhr.addEventListener('load', function(){
            var result = JSON.parse(xhr.responseText);
            if(result.result == "warned"){
                alert('terima kasih');
            }
            else{
                alert('sudah di warn');
            }
        });
    }
}
