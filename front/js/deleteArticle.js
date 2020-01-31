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
    var url = '/penobroldelete/' + p_id;
    var original = {
        'deleteId': p_id
    };
    if (confirm("Are you sure to delete this content?")) {
        if(deleteP){
            deleteP = !deleteP;
            deletePen(url, original);
            setTimeout(function(){
                deleteP = true;
            },2000);
        }
        async function deletePen(url, data) {
            var ajaxResult = await makeRequest(url, data);
            ajaxResult = JSON.parse(ajaxResult);
            if (ajaxResult.result == "deleted") {
                alert('deleted');
                window.location.replace(location.origin + "/penobrol/");
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
    if (confirm("Are you sure to delete this content?")) {
        if(deletePc){
            deletePc = !deletePc;
            deletePcom(url, original);
            setTimeout(function(){
                deletePc = true;
            },2000);
        }
        async function deletePcom(url, data) {
            var ajaxResult = await makeRequest(url, data);
            ajaxResult = JSON.parse(ajaxResult);
            if (ajaxResult.result == "deleted") {
                alert('deleted');
                window.location.replace(location.origin + "/penobrol/" + p_id);
            }
        }

    }
}

function postDeletePccomment(target) {
    var p_id = location.pathname.split('/')[2];
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
                window.location.replace(location.origin + "/penobrol/" + p_id);
            }
        }
    }
}
//////////////////////Tandya//////////////////////
function deleteTandya() {
    var t_id = location.pathname.split('/')[2];
    var url = '/tandyadelete/' + t_id;
    var original = {
        'deleteId': t_id
    };
    if (confirm("Are you sure to delete this content?")) {
        if(deleteT){
            deleteT = !deleteT;
            deleteTan(url, original);
            setTimeout(function(){
                deleteT = true;
            },2000);
        }
        async function deleteTan(url, data) {
            var ajaxResult = await makeRequest(url, data);
            ajaxResult = JSON.parse(ajaxResult);
            if (ajaxResult.result == "deleted") {
                alert('deleted');
                window.location.replace(location.origin + "/tandya");
            }
        }
    }
}

function postDeleteTanswer(target) {
    var t_id = location.pathname.split('/')[2];
    var ta_id = target.getAttribute('value');
    var url = '/tanswerdelete/' + ta_id;
    var original = {
        'deleteId': ta_id,
        'tandyaId': t_id
    };
    if (confirm("Are you sure to delete this content?")) {
        if(deleteTa){
            deleteTa = !deleteTa;
            deleteTans(url, original);
            setTimeout(function(){
                deleteTa = true;
            },2000);
        }
        async function deleteTans(url, data) {
            var ajaxResult = await makeRequest(url, data);
            ajaxResult = JSON.parse(ajaxResult);
            if (ajaxResult.result == "deleted") {
                alert('deleted');
                window.location.replace(location.origin + "/tandya/" + t_id);
            }
        }

    }
}

function postDeleteTacomment(target) {
    var t_id = location.pathname.split('/')[2];
    var tac_id = target.getAttribute('value');
    var url = '/tacommentdelete/' + tac_id;
    var original = {
        'deleteId': tac_id,
        'tandyaId': t_id
    };
    if (confirm("Are you sure to delete this content?")) {
        if(deleteTac){
            deleteTac = !deleteTac;
            deleteTacom(url, original);
            setTimeout(function(){
                deleteTac = true;
            },2000);
        }
        async function deleteTacom(url, data) {
            var ajaxResult = await makeRequest(url, data);
            ajaxResult = JSON.parse(ajaxResult);
            if (ajaxResult.result == "deleted") {
                alert('deleted');
                window.location.replace(location.origin + "/tandya/" + t_id);
            }
        }
    }
}
