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
        var result = JSON.parse(xhr.responseText);
        document.getElementById("plikes").innerHTML = result.p_like;
        likeButton.innerHTML = result.button;
        likeButton.setAttribute('value', result.button);
    });
}

function commentSendAjax(comment){
    var id = comment.value;
    var original = {'clickedValue' : comment.innerHTML};
    original = JSON.stringify(original);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/pCommentlikes/'+id);
    xhr.setRequestHeader('Content-type', "application/json");
    xhr.send(original);
    // 데이터 수신이 완료되면 표시
    xhr.addEventListener('load', function(){
        var result = JSON.parse(xhr.responseText);
        document.getElementById("pCommentlikes"+id).innerHTML = result.pc_like;
        comment.innerHTML = result.button;
    });
}

function ccommentSendAjax(ccomment){
    var pathname = location.pathname;
    var penobrolId = pathname.split('/');
    var commentId = ccomment.name;
    var original = {'ccommentContent' : ccomment.previousSibling.previousSibling.value};
    original = JSON.stringify(original);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/penobrol/'+penobrolId[2]+'/'+commentId);
    xhr.setRequestHeader('Content-type', "application/json");
    xhr.send(original);
    // 데이터 수신이 완료되면 표시
    xhr.addEventListener('load', function(){
        var result = JSON.parse(xhr.responseText);
        var pCcomment = document.getElementById("pCcomment"+commentId);
        var dds1 = document.createElement('dd');
        var dds2 = document.createElement('dd');
        var dds3 = document.createElement('dd');
        dds1.innerHTML = result.ccomment_author;
        dds2.innerHTML = result.ccomment_content;
        dds3.innerHTML = result.ccomment_date;
        pCcomment.append(dds1);
        pCcomment.append(dds2);
        pCcomment.append(dds3);
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
        xhr.open('POST', '/pwarning/'+id);
        xhr.setRequestHeader('Content-type', "application/json");
        xhr.send(original);
        // 데이터 수신이 완료되면 표시
        xhr.addEventListener('load', function(){
            console.log(xhr.responseText);
            var result = JSON.parse(xhr.responseText);
        });
    }
}


