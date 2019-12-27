function warningAjax(warning){
    var warningValue = warning.value.split("/");
    var original = {"warnType" : warningValue[1], "warnId" : warningValue[2]};
    if(warningValue[0]== 'p'){
        postUrl = '/pwarning';
    }
    else{
        postUrl = '/twarning';
    }
    original = JSON.stringify(original);
    if(confirm("Warn this content?")){
        var xhr = new XMLHttpRequest();
        xhr.open('POST', postUrl);
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
