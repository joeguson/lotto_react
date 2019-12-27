var likeButton = document.getElementById('tlikeButton');
var click = true;
likeButton.addEventListener('click', function(){
  //var v = parseInt(document.getElementById('plikes').innerHTML);
  var pathname = location.pathname;
  var id = pathname.split('/');
  var clickedValue = likeButton.value;
  if(click){
    click = !click;
    tLikeSendAjax('/tlikes/'+id[2], clickedValue);
    // 타이밍 추가
    setTimeout(function(){
        click = true;
    },3000);
  }
  else{
    console.log("double");
  }
});

var taInputClick = true;
var taInputButton = document.getElementById('taInputButton');
taInputButton.addEventListener('click', function(){
    if(taInputClick){
        taInputClick = !taInputClick;
        taInputButton.disabled = false;
    }
    else{
        taInputButton.disabled = true;
        console.log('double');
    }
});

function tLikeSendAjax(url, data){
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
    likeButton.setAttribute("value", result.button);
  });
}


var taLikeClick = true;
function answerSendAjax(answer){
  if(taLikeClick){
    taLikeClick = !taLikeClick;
    var id = answer.value.split("/");
    console.log(id);
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
      setTimeout(function(){
          taLikeClick = true;
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

var tacInputClick = true;
function acommentSendAjax(acomment){
    var pathname = location.pathname;
    var tandyaId = pathname.split('/');
    var answerId = acomment.name;
    var original = {'acommentContent' : acomment.previousSibling.previousSibling.value};
    if(tacInputClick){
        tacInputClick = !tacInputClick;
        if(acomment.previousSibling.previousSibling.value.length < 5){
            alert('harus lebih dari 5 alphabet');
            setTimeout(function(){
                tacInputClick = true;
            },1500);
        }
        else{
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
                warnButton.setAttribute('value', 't/tac/'+result.acomment_id);
                warnButton.setAttribute('onclick', 'warningAjax(this)');
                warnButton.innerHTML = '!';
                acomment.previousSibling.previousSibling.value = '';
                dts.innerHTML = '- "' +result.acomment_content+'"';
                dds.innerHTML = 'by '+result.acomment_author+' / '+ datemaker(result.acomment_date);
                dds.append(warnButton);
                dls.append(dts);
                dls.append(dds);
                tAcomment.append(dls);
            });
            setTimeout(function(){
                tacInputClick = true;
            },2500);
        }
    }
    else{
        console.log('double');
    }
}
