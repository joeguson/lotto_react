var pcInputClick = true;
var pcInputButton = document.getElementById('pcInputButton');
pcInputButton.addEventListener('click', function() {
    if (pcInputClick) {
        pcInputClick = !pcInputClick;
        pcInputButton.disabled = false;
    } else {
        pcInputButton.disabled = true;
        console.log('double');
    }
});

var datemaker = function(date) {
    var tempdate = new Date(date);
    var nowdate = new Date();
    var year = tempdate.getFullYear();
    var year = tempdate.getFullYear();
    var month = tempdate.getMonth();
    var day = tempdate.getDate();
    var diff = nowdate - tempdate;
    if (diff > 864000000) {
        return month + '-' + day;
    } else {
        if (diff > 86400000) {
            return parseInt(diff / 86400000) + ' days ago';
        } else {
            if (diff > 3600000) {
                return parseInt(diff / 3600000) + ' h ago';
            } else {
                if (diff > 60000) {
                    return parseInt(diff / 60000) + ' min ago';
                } else {
                    return parseInt(diff / 1000) + ' sec ago';
                }
            }
        }
    }
};

var pccInputClick = true;

function ccommentSendAjax(ccomment) {
    var penobrolId = location.pathname.split('/');
    var commentId = ccomment.name;
    var original = {
        'ccommentContent': ccomment.previousSibling.previousSibling.value
    };
    if (pccInputClick) {
        pccInputClick = !pccInputClick;
        if (ccomment.previousSibling.previousSibling.value.length < 5) {
            alert('harus lebih dari 5 alphabet');
            setTimeout(function() {
                pccInputClick = true;
            }, 1500);
        } else {
            original = JSON.stringify(original);
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/penobrol/add/ccomment/' + penobrolId[3] + '/' + commentId);
            xhr.setRequestHeader('Content-type', "application/json");
            xhr.send(original);
            // 데이터 수신이 완료되면 표시
            xhr.addEventListener('load', function() {
                var result = JSON.parse(xhr.responseText);
                var pCcomment = document.getElementById("pc/" + penobrolId[3] + '/' + commentId);
                var dls = document.createElement('dl');
                var dts = document.createElement('dt');
                var dds = document.createElement('dd');
                // var warnButton = document.createElement('button');
                dls.setAttribute('class', 'dlPccAndTac');
                dts.setAttribute('class', 'dtPccAndTac');
                dds.setAttribute('class', 'ddPccAndTac');
                // warnButton.setAttribute('class', 'pccWarnButton');
                // warnButton.setAttribute('type', 'submit');
                // warnButton.setAttribute('value', 'p/pcc/' + result.ccomment_id);
                // warnButton.setAttribute('onclick', 'warningAjax(this)');
                // warnButton.innerHTML = '!';
                ccomment.previousSibling.previousSibling.value = '';
                dts.innerHTML = '- "' + result.ccomment_content + '"';
                dds.innerHTML = 'by ' + result.ccomment_author + ' / ' + datemaker(result.ccomment_date);
                // dds.append(warnButton);
                dls.append(dts);
                dls.append(dds);
                pCcomment.append(dls);
            });
            setTimeout(function() {
                pccInputClick = true;
            }, 2500);
        }
    } else {
        console.log('double');
    }
}
