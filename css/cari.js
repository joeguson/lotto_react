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
var loadMore = function(number) {
    sendAjax('/cari/load', number);
};
var header = document.querySelector('#header');
var nav = document.querySelector('#nav');
var sub_main = document.querySelector('#sub-main');
var main = document.querySelector('#main');

window.addEventListener('scroll', function(){
    if (document.documentElement.scrollTop*1.03 + document.documentElement.clientHeight  >= document.documentElement.scrollHeight) {
        loadMore();
    }
});
function shuffleRandom(n){
        var ar = new Array();
        var temp;
        var rnum;
        for(var j=1; j<=n; j++){ar.push(j);}
        for(var i=0; i< ar.length ; i++)
        {rnum = Math.floor(Math.random() *n); //난수발생
        temp = ar[i]; ar[i] = ar[rnum];ar[rnum] = temp;}
        return ar;
}

function dateMaker(date){
    var tempdate = new Date(date);
    var nowdate = new Date();
    var year = tempdate.getFullYear();
    var month = tempdate.getMonth();
    var day = tempdate.getDate();
    var diff = nowdate - tempdate;
    if(diff > 864000000){
        return month+'/'+day+'/'+year;
    }
    else{
        if(diff > 86400000){
            return parseInt(diff/86400000)+' days ago';
        }
        else{
            if(diff > 3600000){
                return parseInt(diff/3600000)+' hours ago';
            }
                else{
                    if(diff > 60000){
                        return parseInt(diff/60000)+' minutes ago';
                    }
                    else{
                        return parseInt(diff/1000)+' seconds ago';
                    }
                }
        }
    }
    
}
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
        console.log(result);
        var randoms = shuffleRandom(9);
        var randomul = document.getElementById('uls');
        for(var i=0; i<9; i++){
            var lis = document.createElement('li');
            var as = document.createElement('a');
            var dls = document.createElement('dl');
            var dts = document.createElement('dt');
            var span_id = document.createElement('span');
            var dds1 = document.createElement('dd');
            var dds2 = document.createElement('dd');
            var dds3 = document.createElement('dd');
            var dds4 = document.createElement('dd');
            if(result.data[randoms[i]].identifier === 'p'){
                as.innerHTML = result.data[randoms[i]].title;
                as.setAttribute('style', 'display:block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;');
                as.setAttribute('href', '/penobrol/'+result.data[randoms[i]].id);
                span_id.innerHTML = 'P';
                dds1.innerHTML = result.data[randoms[i]].content;
                dds1.setAttribute('style', 'display:block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;');
                dds2.innerHTML = result.data[randoms[i]].author;
                dds3.innerHTML = result.data[randoms[i]].p_view;
                dds4.innerHTML = dateMaker(result.data[randoms[i]].date);
            }
            else{
                as.innerHTML = result.data[randoms[i]].question;
                as.setAttribute('href', '/tandya/'+result.data[randoms[i]].id);
                span_id.innerHTML = 'T';
                dds1.innerHTML = result.data[randoms[i]].content;
                dds1.setAttribute('style', 'display:block;');
                dds2.innerHTML = result.data[randoms[i]].author;
                dds3.innerHTML = result.data[randoms[i]].t_view;
                 dds4.innerHTML = dateMaker(result.data[randoms[i]].date);
            }
            dts.appendChild(as);
            dls.appendChild(dts);
            dls.appendChild(dds1);
            dls.appendChild(dds2);
            dls.appendChild(dds3);
            dls.appendChild(dds4);
            lis.appendChild(span_id);
            lis.appendChild(dls);
            randomul.appendChild(lis);
        }
  });
}
loadMore(10);

















