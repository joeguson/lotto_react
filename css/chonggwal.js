var countp = document.getElementById('count');

var timer = setInterval(myTimer, 10000);
function myTimer(){
    var countseconds = 10;
    var sec = setInterval(function(){
        if(countseconds == 0){
            countseconds = 10;
        }
        countp.innerHTML = countseconds;
        countseconds--;
    }, 1000);
}

function sendAjax(url, data){
    var data2 = {'u_id' : data};
    data2 = JSON.stringify(data2);
    var xhr = new XMLHttpRequest();
    xhr.open('post', url);
    xhr.setRequestHeader('Content-type', "application/json");
    xhr.send(data2);
    // 데이터 수신이 완료되면 표시
    xhr.addEventListener('load', function(){
        var result = JSON.parse(xhr.responseText);
        if(result.result !== 'ok') return;
        // 데이터가 있으면 결과값 표시
        
  });
}




