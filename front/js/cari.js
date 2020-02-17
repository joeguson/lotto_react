
var loadMore = function() {
    sendAjax('api/cari');
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
        result.data.map((data) => {
            var lis = document.createElement("b-thumbnail");
            lis.setAttribute("jsonSrc", JSON.stringify(data));
            return lis;
        }).forEach((li) => { randomul.appendChild(li); });
  });
}
