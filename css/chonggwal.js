var countp = document.getElementById('count');

var countsec = 10;
var timer = setInterval(myTimer, 1000);
function myTimer(){
    if(countsec === 0){
        countsec=10;
    }
    countsec -= 1;
    countp.innerHTML = countsec;
}

function sendAjax(url){
    var xhr = new XMLHttpRequest();
    xhr.open('post', url);
    xhr.setRequestHeader('Content-type', "application/json");
    // 데이터 수신이 완료되면 표시
    xhr.addEventListener('load', function(){
        var result = JSON.parse(xhr.responseText);
        if(result.result !== 'ok') return;
        // 데이터가 있으면 결과값 표시
  });
}




