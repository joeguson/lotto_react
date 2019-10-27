var likeButton = document.getElementById('likeButton');

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
        console.log(xhr.responseText);
        var result = JSON.parse(xhr.responseText);
        document.getElementById("tlikes").innerHTML = result.t_like;
        likeButton.innerHTML = result.button;
        likeButton.setAttribute('value', result.button);
    });
}

function answerSendAjax(answer){
    var id = answer.value;
    var original = {'clickedValue' : answer.innerHTML};
    original = JSON.stringify(original);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/tAnswerlikes/'+id);
    xhr.setRequestHeader('Content-type', "application/json");
    xhr.send(original);
    // 데이터 수신이 완료되면 표시
    xhr.addEventListener('load', function(){
        console.log(xhr.responseText);
        var result = JSON.parse(xhr.responseText);
        document.getElementById("tAnswerlikes"+id).innerHTML = result.ta_like;
        answer.innerHTML = result.button;
    });
}

function acommentSendAjax(acomment){
    var pathname = location.pathname;
    var tandyalId = pathname.split('/');
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
        var tAcomment = document.getElementById("tAcomment"+answerId);
        var dds1 = document.createElement('dd');
        var dds2 = document.createElement('dd');
        var dds3 = document.createElement('dd');
        dds1.innerHTML = result.acomment_id;
        tAcomment.append(dds1);
    });
}
function warningAjax(warning){
    var id = warning.value;
    var confirmWarning = function(){
        return confirm("really?");
    }
    var confirmedValue = confirmWarning();
    console.log(confirmedValue);
    if(confirmedValue == true){
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/twarning/'+id);
        xhr.setRequestHeader('Content-type', "application/json");
        xhr.send(original);
        // 데이터 수신이 완료되면 표시
        xhr.addEventListener('load', function(){
            console.log(xhr.responseText);
            var result = JSON.parse(xhr.responseText);
        });
    }
}


