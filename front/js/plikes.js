var likeButton = document.getElementById('plikeButton');
var click = true;
likeButton.addEventListener('click', function(){
  //var v = parseInt(document.getElementById('plikes').innerHTML);
  var pathname = location.pathname;
  var id = pathname.split('/');
  var clickedValue = likeButton.value;
  console.log(clickedValue);
  if(click){
    click = !click;
    plikeSendAjax('/plikes/'+id[2], clickedValue);
    // 타이밍 추가
    setTimeout(function(){
        click = true;
    },3000);
  }
  else{
    console.log("double");
  }
});

function plikeSendAjax(url, data){
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
      likeButton.setAttribute("value", result.button);
    });
}

var pcInputClick = true;
var pcInputButton = document.getElementById('pcInputButton');
pcInputButton.addEventListener('click', function(){
    if(pcInputClick){
        pcInputClick = !pcInputClick;
        pcInputButton.disabled = false;
    }
    else{
        pcInputButton.disabled = true;
        console.log('double');
    }
});

var pcLikeClick = true;
function pcLikeSendAjax(comment){
  if(pcLikeClick){
    pcLikeClick = !pcLikeClick;
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
      setTimeout(function(){
          pcLikeClick = true;
      },2000);
    });
  }
  else{
    console.log("double");
  }
}

var datemaker = function(date){
  var tempdate = new Date(date);
  var nowdate = new Date();
  var year = tempdate.getFullYear();
  var year = tempdate.getFullYear();
  var month = tempdate.getMonth();
  var day = tempdate.getDate();
  var diff = nowdate - tempdate;
  if(diff > 864000000){return month+'-'+day;}
  else{
    if(diff > 86400000){return parseInt(diff/86400000)+' days ago';}
    else{
      if(diff > 3600000){return parseInt(diff/3600000)+' h ago';}
      else{
        if(diff > 60000){return parseInt(diff/60000)+' min ago';}
        else{return parseInt(diff/1000)+' sec ago';}
      }
    }
  }
};

var pccInputClick = true;
function ccommentSendAjax(ccomment){
  var penobrolId = location.pathname.split('/');
  var commentId = ccomment.name;
  var original = {'ccommentContent' : ccomment.previousSibling.previousSibling.value};
  if(pccInputClick){
    pccInputClick = !pccInputClick;
    if(ccomment.previousSibling.previousSibling.value.length < 5){
      alert('harus lebih dari 5 alphabet');
      setTimeout(function(){
          pccInputClick = true;
      },1500);
    }
    else{
      original = JSON.stringify(original);
      var xhr = new XMLHttpRequest();
      xhr.open('POST', '/pccomment/'+penobrolId[2]+'/'+commentId);
      xhr.setRequestHeader('Content-type', "application/json");
      xhr.send(original);
      // 데이터 수신이 완료되면 표시
      xhr.addEventListener('load', function(){
        var result = JSON.parse(xhr.responseText);
        var pCcomment = document.getElementById("pc/"+penobrolId[2]+'/'+commentId).getElementsByTagName("dd")[0];
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
        warnButton.innerHTML = '!';
        ccomment.previousSibling.previousSibling.value = '';
        dts.innerHTML = '- "' +result.ccomment_content+'"';
        dds.innerHTML = 'by '+result.ccomment_author+' / '+ datemaker(result.ccomment_date);
        dds.append(warnButton);
        dls.append(dts);
        dls.append(dds);
        pCcomment.append(dls);
      });
      setTimeout(function(){
        pccInputClick = true;
      },2500);
    }
  }
  else{
    console.log('double');
  }
}
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
function deletePenobrol(){
  var p_id = location.pathname.split('/')[2];
  var original = {'deleteId' : p_id};
  original = JSON.stringify(original);
  if(confirm("Are you sure to delete this content?")){
    var xhr = new XMLHttpRequest();
    xhr.open('post', '/penobrol/delete/'+p_id);
    xhr.setRequestHeader('Content-type', "application/json");
    xhr.send(original);
    console.log(original);
    // 데이터 수신이 완료되면 표시
    xhr.addEventListener('load', function(){
      var result = JSON.parse(xhr.responseText);
      console.log(result);
      if(result.result == "deleted"){
        alert('deleted');
        window.location.replace("http://localhost:3000/penobrol/");
      }
    });
  }
}
