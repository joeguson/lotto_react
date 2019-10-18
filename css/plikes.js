var likeButton = document.getElementById('likeButton');

likeButton.addEventListener('click', function(){
    //var v = parseInt(document.getElementById('plikes').innerHTML);
    var pathname = location.pathname;
    var id = pathname.split('/');
    var clickedValue = likeButton.value;
    contentSendAjax('/plikes/'+id[2], clickedValue);
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
        document.getElementById("plikes").innerHTML = result.p_like;
        likeButton.innerHTML = result.button;
        likeButton.setAttribute('value', result.button);
    });
}
function commentSendAjax(target){
    var id = target.value;
    console.log(id);
    var original = {'clickedValue' : target.innerHTML};
    original = JSON.stringify(original);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/pCommentlikes/'+id);
    xhr.setRequestHeader('Content-type', "application/json");
    xhr.send(original);
    // 데이터 수신이 완료되면 표시
    xhr.addEventListener('load', function(){
        console.log(xhr.responseText);
        var result = JSON.parse(xhr.responseText);
        document.getElementById("pCommentlikes"+id).innerHTML = result.pc_like;
        target.innerHTML = result.button;
    });
}

