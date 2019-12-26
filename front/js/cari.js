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
            if(result.data[i].identifier == 'p'){
                as.innerHTML = result.data[i].title;
                as.setAttribute('href', '/penobrol/'+result.data[i].id);
                dds1.innerHTML = result.data[i].content;
                dds1.setAttribute('class', 'ddcontent');
                if(result.data[i].hashtags.length > 0)
                {
                    var temp = '';
                    for(var h of result.data[i].hashtags)
                        temp += '#'+h.hash + ' ';
                    dds2.innerHTML = temp;
                }
                dds3.innerHTML =result.data[i].date + ' / ' + result.data[i].view + ' views';
            }
            else{
                as.innerHTML = result.data[i].question;
                as.setAttribute('href', '/tandya/'+result.data[i].id);
                dds1.innerHTML = result.data[i].content;
                dds1.setAttribute('class', 'ddcontent');
                if(result.data[i].hashtags.length > 0)
                {
                    var temp = '';
                    for(var h of result.data[i].hashtags)
                        temp += '#'+h.hash + ' ';
                    dds2.innerHTML = temp;
                }
                dds3.innerHTML = result.data[i].date + ' / ' + result.data[i].view + ' views';
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
