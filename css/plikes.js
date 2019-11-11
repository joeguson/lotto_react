var likeButton = document.getElementById('plikeButton');

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
        document.getElementById("plike").innerHTML = result.p_like;
        likeButton.innerHTML = result.button;
        likeButton.setAttribute('value', result.button);
    });
}

function commentSendAjax(comment){
    var id = comment.value.split("/");
    var original = {'clickedValue' : comment.innerHTML, 'p_id':id[0], 'pc_id':id[1]};
    original = JSON.stringify(original);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/pCommentlikes/'+id[1]);
    xhr.setRequestHeader('Content-type', "application/json");
    xhr.send(original);
    // 데이터 수신이 완료되면 표시
    xhr.addEventListener('load', function(){
        var result = JSON.parse(xhr.responseText);
        document.getElementById("pCommentlikes"+id[1]).innerHTML = result.pc_like;
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
        var pCcomment = document.getElementById("pc/"+penobrolId[2]+'/'+commentId);
        var dls = document.createElement('dl');
        var dts = document.createElement('dt');
        var dds = document.createElement('dd');
        var warnButton = document.createElement('button');
        dls.setAttribute('class', 'pccomment-dl');
        dts.setAttribute('class', 'pccomment-dt');
        dds.setAttribute('class', 'pccomment-dd');
        warnButton.setAttribute('class', 'pccWarnButton');
        warnButton.setAttribute('type', 'submit');
        warnButton.setAttribute('value', 'pcc/'+penobrolId[2]+'/'+commentId+'/'+result.ccomment_id);
        warnButton.setAttribute('id', 'warn/pcc/'+penobrolId[2]+'/'+commentId+'/'+result.ccomment_id);
        warnButton.setAttribute('onclick', 'warningAjax(this)');
        
        dts.innerHTML = '- "' +result.ccomment_content+'"';
        dds.innerHTML = 'by '+result.ccomment_author+' / '+ result.ccomment_date;
        
        dds.append(warnButton);
        dls.append(dts);
        dls.append(dds);
        pCcomment.append(dls);
    });
}
function warningAjax(warning){
    var warningValue = warning.value.split("/");
    var confirmWarning = function(){
        return confirm("really?");
    };
    var confirmedValue = confirmWarning();
    console.log(confirmedValue);
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



