//document.getElementsByTagName('section');
//
//var listElm = document.querySelector('#infinite-list');
//// Add 20 items.
//var nextItem = 1;

//
//// Detect when scrolled to bottom.
//listElm.addEventListener('scroll', function() {
//  
//    }
//});
//// Initially load some items.
//loadMore();
var loadMore = function() {
    sendAjax('/cari/load');
};

var header = document.querySelector('#header');
var nav = document.querySelector('#nav');
var sub_main = document.querySelector('#sub-main');
var main = document.querySelector('#main');

window.addEventListener('scroll', function(){
    if (document.documentElement.scrollTop * 1.03 + document.documentElement.clientHeight  >= document.documentElement.scrollHeight) {
        loadMore();
    }
});
function shuffleRandom(n){
        var ar = new Array();
        var temp;
        var rnum;
        for(var j=0; j<n; j++){ar.push(j);}
        for(var i=0; i< ar.length ; i++)
        {rnum = Math.floor(Math.random() *n); //난수발생
        temp = ar[i]; ar[i] = ar[rnum];ar[rnum] = temp;}
        return ar;
}

var phashtagfinder = function(pid, hashtags){
    var temp = [];
    for(var i=0; i<hashtags.length; i++){
        if(hashtags[i].p_id == pid){
            temp.push(hashtags[i].hash);
        }
    }
    return temp;
};

var thashtagfinder = function(tid, hashtags){
    var temp = [];
    for(var i=0; i<hashtags.length; i++){
        if(hashtags[i].t_id == tid){
            temp.push(hashtags[i].hash);
        }
    }
    return temp;
};

function sendAjax(url){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.setRequestHeader('Content-type', "application/json");
    xhr.send();
    // 데이터 수신이 완료되면 표시
    xhr.addEventListener('load', function(){
        var result = JSON.parse(xhr.responseText);
        if(result.result !== 'ok') return;
        // 데이터가 있으면 결과값 표시
        var randoms = shuffleRandom(result.data.length);
        var randomul = document.getElementById('uls');
        for(var i=0; i<result.data.length; i++){
            var lis = document.createElement('li');
            var as = document.createElement('a');
            var dls = document.createElement('dl');
            var dts = document.createElement('dt');
            var span_id = document.createElement('span');
            var dds1 = document.createElement('dd');
            var dds2 = document.createElement('dd');
            var dds3 = document.createElement('dd');
            if(result.data[randoms[i]].identifier == 'p'){
                var phashtagfind = phashtagfinder(result.data[randoms[i]].id, result.hashtag);
                var phashtagfinal = hashtagmaker(phashtagfind);
                as.innerHTML = result.data[randoms[i]].title;
                as.setAttribute('href', '/penobrol/'+result.data[randoms[i]].id);
                dds1.innerHTML = result.data[randoms[i]].content;
                dds1.setAttribute('class', 'ddcontent');
                dds2.innerHTML = phashtagfinal;
                dds3.innerHTML = dateMaker(result.data[randoms[i]].date) + ' / ' + result.data[randoms[i]].p_view + ' views' + ' / '+result.data[randoms[i]].com+' comments';
            }
            else{
                var thashtagfind = thashtagfinder(result.data[randoms[i]].id, result.hashtag);
                var thashtagfinal = hashtagmaker(thashtagfind);
                as.innerHTML = result.data[randoms[i]].question;
                as.setAttribute('href', '/tandya/'+result.data[randoms[i]].id);
                dds1.innerHTML = result.data[randoms[i]].content;
                dds1.setAttribute('class', 'ddcontent');
                dds2.innerHTML = thashtagfinal;
                dds3.innerHTML = dateMaker(result.data[randoms[i]].date) + ' / ' + result.data[randoms[i]].t_view + ' views'+ ' / '+result.data[randoms[i]].answer+' answers';
            }
            dts.appendChild(as);
            dls.appendChild(dts);
            dls.appendChild(dds1);
            dls.appendChild(dds2);
            dls.appendChild(dds3);
            lis.appendChild(dls);
            randomul.appendChild(lis);
        }
  });
}
