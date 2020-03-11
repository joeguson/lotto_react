//////////////////////Ajax//////////////////////
function makeRequest(method, url, data) {
    return new Promise(function (resolve, reject) {
        var original = JSON.stringify(data);
        var xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.setRequestHeader('Content-type', "application/json");
        xhr.send(original);
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
                console.log("refresh");
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
                console.log("fail");
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
    });
}

setInterval(AjaxFiveSec, 1000);
let countsec = 5;
function AjaxFiveSec(){
    if(countsec === 0){
        countsec=5;
        makeRequest('get','/api/samusil', null).then((res)=>{
             res = JSON.parse(res);
             document.getElementById("users").innerText = ("count user : "+ res.users);
             document.getElementById("penobrol").innerText = ("count penobrol : "+ res.penobrol);
             document.getElementById("tandya").innerText = ("count tandya : "+ res.tandya);
             document.getElementById("youtublog").innerText = ("count youtublog : "+ res.youtublog);
             document.getElementById("comment").innerText = ("count comment : "+ res.comment);
             document.getElementById("answer").innerText = ("count answer : "+ res.answer);
        });
    }
    countsec -= 1;
}
