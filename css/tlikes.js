var likeButton = document.getElementById('tlikeButton');

likeButton.addEventListener('click', function(){
    //var v = parseInt(document.getElementById('plikes').innerHTML);
    var pathname = location.pathname;
    var id = pathname.split('/');
    var clickedValue = likeButton.value;
    contentSendAjax('/tlikes/'+id[2], clickedValue);
});

function contentSendAjax(url, data){
    var original = {'clickedValue' : data};
    original = JSON.stringify(original);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-type', "application/json");
    xhr.send(original);
    // 데이터 수신이 완료되면 표시
    xhr.addEventListener('load', function(){
        var result = JSON.parse(xhr.responseText);
        document.getElementById("tlike").innerHTML = result.t_like;
        likeButton.innerHTML = result.button;
        likeButton.setAttribute('value', result.button);
    });
}

function answerSendAjax(answer){
    var id = answer.value.split("/");
    var original = {'clickedValue' : answer.innerHTML, 't_id':id[0], 'ta_id':id[1]};
    original = JSON.stringify(original);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/tAnswerlikes/'+id[1]);
    xhr.setRequestHeader('Content-type', "application/json");
    xhr.send(original);
    // 데이터 수신이 완료되면 표시
    xhr.addEventListener('load', function(){
        var result = JSON.parse(xhr.responseText);
        document.getElementById("tAnswerlikes"+id[1]).innerHTML = result.ta_like;
        answer.innerHTML = result.button;
    });
}

function acommentSendAjax(acomment){
    var pathname = location.pathname;
    var tandyaId = pathname.split('/');
    var answerId = acomment.name;
    var original = {'acommentContent' : acomment.previousSibling.previousSibling.value};
    original = JSON.stringify(original);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/tandya/'+tandyaId[2]+'/'+answerId);
    xhr.setRequestHeader('Content-type', "application/json");
    xhr.send(original);
    // 데이터 수신이 완료되면 표시
    xhr.addEventListener('load', function(){
        var result = JSON.parse(xhr.responseText);
        var tAcomment = document.getElementById("ta/"+tandyaId[2]+'/'+answerId);
        var dls = document.createElement('dl');
        var dts = document.createElement('dt');
        var dds = document.createElement('dd');
        var warnButton = document.createElement('button');
        
        dls.setAttribute('class', 'tacomment-dl');
        dts.setAttribute('class', 'tacomment-dt');
        dds.setAttribute('class', 'tacomment-dd');
        warnButton.setAttribute('class', 'tacWarnButton');
        warnButton.setAttribute('type', 'submit');
        warnButton.setAttribute('value', 'tac/'+tandyaId[2]+'/'+answerId+'/'+result.acomment_id);
        warnButton.setAttribute('id', 'warn/tac/'+tandyaId[2]+'/'+answerId+'/'+result.acomment_id);
        warnButton.setAttribute('onclick', 'warningAjax(this)');
        
        dts.innerHTML = '- "' +result.acomment_content+'"';
        dds.innerHTML = 'by '+result.acomment_author+' / '+ result.acomment_date;
        
        dds.append(warnButton);
        dls.append(dts);
        dls.append(dds);
        tAcomment.append(dls);
    });
}
function warningAjax(warning){
    var warningValue = warning.value.split("/");
    var confirmWarning = function(){
        return confirm("really?");
    };
    var confirmedValue = confirmWarning();
    var original = {'warnedItem' : warningValue[0], "warnedT" : warningValue[1], "warnedA" : warningValue[2], "warnedC" : warningValue[3]};
    original = JSON.stringify(original);
    if(confirmedValue == true){
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/twarning/');
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




