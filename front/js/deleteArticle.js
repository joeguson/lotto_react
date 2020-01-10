//////////////////////Variables//////////////////////
var deleteP = true;
var deletePc = true;
var deletePcc = true;
var deleteT = true;
var deleteTa = true;
var deleteTac = true;

//////////////////////Ajax//////////////////////
function makeRequest(url, data) {
    return new Promise(function (resolve, reject) {
        var original = JSON.stringify(data);
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url);
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
//////////////////////Penobrol//////////////////////
function deletePenobrol() {
    var p_id = location.pathname.split('/')[2];
    var original = {
        'deleteId': p_id
    };
    var url = '/penobroldelete/' + p_id;
    original = JSON.stringify(original);
    if (confirm("Are you sure to delete this content?")) {
        if(deleteP){
            deleteP = !deleteP;
            deletePen(url, data);
            setTimeout(function(){
                deleteP = true;
            },2000);
        }
        async function deletePen(url, data) {
            var ajaxResult = await makeRequest(url, data);
            ajaxResult = JSON.parse(ajaxResult);
            var result = JSON.parse(xhr.responseText);
            if (result.result == "deleted") {
                alert('deleted');
                window.location.replace("http://localhost:3000/penobrol/");
            }
        }
    }
}

function postDeletePcomment(target) {
    var p_id = location.pathname.split('/')[2];
    var pc_id = target.getAttribute('value');
    var url = '/pcommentdelete/' + pc_id;
    var original = {
        'deleteId': pc_id,
        'penobrolId': p_id
    };
    original = JSON.stringify(original);
    if (confirm("Are you sure to delete this content?")) {
        if(deletePc){
            deletePc = !deletePc;
            deletePcom(url, data);
            setTimeout(function(){
                deletePc = true;
            },2000);
        }
        async function deletePcom(url, data) {
            var ajaxResult = await makeRequest(url, data);
            ajaxResult = JSON.parse(ajaxResult);
            var result = JSON.parse(xhr.responseText);
            if (result.result == "deleted") {
                alert('deleted');
                window.location.replace("http://localhost:3000/penobrol/" + p_id);
            }
        }

    }
}

function postDeletePccomment(target) {
    var p_id = location.pathname.split('/')[2];
    console.log(target.value);
    var pcc_id = target.getAttribute('value');
    var url = '/pccommentdelete/' + pcc_id;
    var original = {
        'deleteId': pcc_id,
        'penobrolId': p_id
    };
    if (confirm("Are you sure to delete this content?")) {
        if(deletePcc){
            deletePcc = !deletePcc;
            deletePccom(url, original);
            setTimeout(function(){
                deletePcc = true;
            },2000);
        }
        async function deletePccom(url, data) {
            var ajaxResult = await makeRequest(url, data);
            ajaxResult = JSON.parse(ajaxResult);
            if (ajaxResult.result == "deleted") {
                alert('deleted');
                window.location.replace("http://localhost:3000/penobrol/" + p_id);
            }
        }
    }
}
//////////////////////Tandya//////////////////////
