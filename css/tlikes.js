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

function answerSendAjax(target){
    var id = target.value;
    var original = {'clickedValue' : target.innerHTML};
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
        target.innerHTML = result.button;
    });
}
