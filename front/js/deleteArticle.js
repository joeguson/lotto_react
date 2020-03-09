//////////////////////Variables//////////////////////
let deleteP = true;
let deletePc = true;
let deletePcc = true;
let deleteT = true;
let deleteTa = true;
let deleteTac = true;
let deleteY = true;
let deleteYc = true;
let deleteYcc = true;

//////////////////////Penobrol//////////////////////
function deletePenobrol() {
    let p_id = location.pathname.split('/')[2];
    let url = '/penobrol/' + p_id;
    let original = {
        'deleteId': p_id
    };
    if (confirm("Are you sure to delete this content?")) {
        if(deleteP){
            deleteP = !deleteP;
            deleteResult('p', url, original, p_id);
            setTimeout(function(){
                deleteP = true;
            },2000);
        }
    }
}

function postDeletePcomment(target) {
    let p_id = location.pathname.split('/')[2];
    let pc_id = target.getAttribute('value');
    let url = '/penobrol/comment/' + pc_id;
    let original = {
        'deleteId': pc_id,
        'penobrolId': p_id
    };
    if (confirm("Are you sure to delete this content?")) {
        if(deletePc){
            deletePc = !deletePc;
            deleteResult('pc', url, original, p_id);
            setTimeout(function(){
                deletePc = true;
            },2000);
        }
    }
}

function postDeletePccomment(target) {
    let p_id = location.pathname.split('/')[2];
    let pcc_id = target.getAttribute('value');
    let url = '/penobrol/ccomment/' + pcc_id;
    let original = {
        'deleteId': pcc_id,
        'penobrolId': p_id
    };
    if (confirm("Are you sure to delete this content?")) {
        if(deletePcc){
            deletePcc = !deletePcc;
            deleteResult('pcc', url, original, p_id);
            setTimeout(function(){
                deletePcc = true;
            },2000);
        }
    }
}
//////////////////////Tandya//////////////////////
function deleteTandya() {
    let t_id = location.pathname.split('/')[2];
    let url = '/tandya/' + t_id;
    let original = {
        'deleteId': t_id
    };
    if (confirm("Are you sure to delete this content?")) {
        if(deleteT){
            deleteT = !deleteT;
            deleteResult('t', url, original, t_id);
            setTimeout(function(){
                deleteT = true;
            },2000);
        }
    }
}

function postDeleteTanswer(target) {
    let t_id = location.pathname.split('/')[2];
    let ta_id = target.getAttribute('value');
    let url = '/tandya/answer/' + ta_id;
    let original = {
        'deleteId': ta_id,
        'tandyaId': t_id
    };
    if (confirm("Are you sure to delete this content?")) {
        if(deleteTa){
            deleteTa = !deleteTa;
            deleteResult('ta', url, original, t_id);
            setTimeout(function(){
                deleteTa = true;
            },2000);
        }
    }
}

function postDeleteTacomment(target) {
    let t_id = location.pathname.split('/')[2];
    let tac_id = target.getAttribute('value');
    let url = '/tandya/acomment/' + tac_id;
    let original = {
        'deleteId': tac_id,
        'tandyaId': t_id
    };
    if (confirm("Are you sure to delete this content?")) {
        if(deleteTac){
            deleteTac = !deleteTac;
            deleteResult('tac', url, original, t_id);
            setTimeout(function(){
                deleteTac = true;
            },2000);
        }
    }
}
//////////////////////Youtublog//////////////////////
function deleteYoutublog() {
    let y_id = location.pathname.split('/')[2];
    let url = '/youtublog/' + y_id;
    let original = {
        'deleteId': y_id
    };
    if (confirm("Are you sure to delete this content?")) {
        if(deleteY){
            deleteY = !deleteY;
            deleteResult('y', url, original, y_id);
            setTimeout(function(){
                deleteY = true;
            },2000);
        }
    }
}

function postDeleteYcomment(target) {
    let y_id = location.pathname.split('/')[2];
    let yc_id = target.getAttribute('value');
    let url = '/youtublog/comment/' + yc_id;
    let original = {
        'deleteId': yc_id,
        'youtublogId': y_id
    };
    if (confirm("Are you sure to delete this content?")) {
        if(deleteYc){
            deleteYc = !deleteYc;
            deleteResult('yc', url, original, y_id);
            setTimeout(function(){
                deleteYc = true;
            },2000);
        }
    }
}

function postDeleteYccomment(target) {
    let y_id = location.pathname.split('/')[2];
    let ycc_id = target.getAttribute('value');
    let url = '/youtublog/ccomment/' + ycc_id;
    let original = {
        'deleteId': ycc_id,
        'youtublogId': y_id
    };
    if (confirm("Are you sure to delete this content?")) {
        if(deleteYcc){
            deleteYcc = !deleteYcc;
            deleteResult('ycc', url, original, y_id);
            setTimeout(function(){
                deleteYcc = true;
            },2000);
        }
    }
}

async function deleteResult(type, url, data, refreshId) {
    let ajaxResult = await makeRequest('delete', url, data);
    ajaxResult = JSON.parse(ajaxResult);
    if (ajaxResult.result == "deleted") {
        alert('deleted');
        if(type === 'p') window.location.replace(location.origin + "/penobrol");
        else if(type === 't') window.location.replace(location.origin + "/tandya");
        else if(type === 'y') window.location.replace(location.origin + "/youtublog");
        else if(type ==='pc' || type === 'pcc') window.location.replace(location.origin + "/penobrol/" + refreshId);
        else if(type ==='ta' || type === 'tac') window.location.replace(location.origin + "/tandya/" + refreshId);
        else window.location.replace(location.origin + "/youtublog/" + refreshId);
    }
}
