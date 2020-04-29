function makeRequest(method, url, data) {
    return new Promise(function (resolve, reject) {
        let original = JSON.stringify(data);
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.setRequestHeader('Content-type', "application/json");
        xhr.send(original);
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
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

function __createMask(){
    const maskDiv = document.createElement('div');
    const body = document.getElementsByTagName('body');
    maskDiv.style.backgroundColor = "white";
    maskDiv.style.position = "absolute";
    maskDiv.style.top = "0";
    maskDiv.style.right = "0";
    maskDiv.style.bottom = "0";
    maskDiv.style.left = "0";
    maskDiv.style.float = "left";
    maskDiv.style.width = "100%";
    maskDiv.style.height = body[0].scrollHeight + 'px';
    maskDiv.style.opacity = ".8";
    maskDiv.style.zIndex = "5";
    body[0].appendChild(maskDiv);
}

function __showLoading(){
    const loadDiv = document.createElement('div');
    const body = document.getElementsByTagName('body');
    console.log(body);
    loadDiv.style.position = "fixed";
    loadDiv.style.top = "35%";
    loadDiv.style.right = "45%";
    loadDiv.style.border = "10px solid #f3f3f3";
    loadDiv.style.zIndex = "6";
    loadDiv.style.borderRadius = "50%";
    loadDiv.style.borderTop = "10px solid #0f4c81";
    loadDiv.style.width = "80px";
    loadDiv.style.height = "80px";
    loadDiv.style.animation = "spin 2s linear infinite";
    loadDiv.style.webkitAnimation = "spin 2s linear infinite";

    body[0].appendChild(loadDiv);
}


