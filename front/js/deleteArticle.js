function deletePenobrol() {
    var p_id = location.pathname.split('/')[2];
    var original = {
        'deleteId': p_id
    };
    original = JSON.stringify(original);
    if (confirm("Are you sure to delete this content?")) {
        var xhr = new XMLHttpRequest();
        xhr.open('post', '/penobroldelete/' + p_id);
        xhr.setRequestHeader('Content-type', "application/json");
        xhr.send(original);
        // 데이터 수신이 완료되면 표시
        xhr.addEventListener('load', function() {
            var result = JSON.parse(xhr.responseText);
            if (result.result == "deleted") {
                alert('deleted');
                window.location.replace("http://localhost:3000/penobrol/");
            }
        });
    }
}

function postDeletePcomment(target) {
    var p_id = location.pathname.split('/')[2];
    var pc_id = target.getAttribute('value');
    var original = {
        'deleteId': pc_id,
        'penobrolId': p_id
    };
    original = JSON.stringify(original);
    if (confirm("Are you sure to delete this content?")) {
        var xhr = new XMLHttpRequest();
        xhr.open('post', '/pcommentdelete/' + pc_id);
        xhr.setRequestHeader('Content-type', "application/json");
        xhr.send(original);
        // 데이터 수신이 완료되면 표시
        xhr.addEventListener('load', function() {
            var result = JSON.parse(xhr.responseText);
            console.log(result);
            if (result.result == "deleted") {
                alert('deleted');
                window.location.replace("http://localhost:3000/penobrol/" + p_id);
            }
        });
    }
}

function postDeletePccomment(target) {
    var p_id = location.pathname.split('/')[2];
    var pcc_id = target.getAttribute('value');
    var original = {
        'deleteId': pcc_id,
        'penobrolId': p_id
    };
    original = JSON.stringify(original);
    if (confirm("Are you sure to delete this content?")) {
        var xhr = new XMLHttpRequest();
        xhr.open('post', '/pccommentdelete/' + pcc_id);

        xhr.setRequestHeader('Content-type', "application/json");
        xhr.send(original);
        // 데이터 수신이 완료되면 표시
        xhr.addEventListener('load', function() {
            console.log('in delete');
            var result = JSON.parse(xhr.responseText);
            console.log(result);
            if (result.result == "deleted") {
                alert('deleted');
                window.location.replace("http://localhost:3000/penobrol/" + p_id);
            }
        });
    }
}
