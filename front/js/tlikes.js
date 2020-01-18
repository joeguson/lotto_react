var tacInputClick = true;
function acommentSendAjax(acomment){
    var pathname = location.pathname;
    var tandyaId = pathname.split('/');
    var answerId = acomment.name;
    var original = {'acommentContent' : acomment.previousSibling.previousSibling.value};
    if(tacInputClick){
        tacInputClick = !tacInputClick;
        if(acomment.previousSibling.previousSibling.value.length < 5){
            alert('harus lebih dari 5 alphabet');
            setTimeout(function(){
                tacInputClick = true;
            },1500);
        }
        else{
            original = JSON.stringify(original);
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/tandya/'+tandyaId[2]+'/'+answerId);
            xhr.setRequestHeader('Content-type', "application/json");
            xhr.send(original);
            // 데이터 수신이 완료되면 표시
            xhr.addEventListener('load', function(){
                var result = JSON.parse(xhr.responseText);
                var tAcomment = document.getElementById("ta/"+tandyaId[2]+'/'+answerId);
                var dls = document.createElement('dl');
                var dts = document.createElement('dt');
                var dds = document.createElement('dd');
                // var warnButton = document.createElement('button');
                dls.setAttribute('class', 'dlPccAndTac');
                dts.setAttribute('class', 'dtPccAndTac');
                dds.setAttribute('class', 'ddPccAndTac');
                // warnButton.setAttribute('class', 'tacWarnButton');
                // warnButton.setAttribute('type', 'submit');
                // warnButton.setAttribute('value', 't/tac/'+result.acomment_id);
                // warnButton.setAttribute('onclick', 'warningAjax(this)');
                // warnButton.innerHTML = '!';
                acomment.previousSibling.previousSibling.value = '';
                dts.innerHTML = '- "' +result.acomment_content+'"';
                dds.innerHTML = 'by '+result.acomment_author+' / '+ datemaker(result.acomment_date);
                // dds.append(warnButton);
                dls.append(dts);
                dls.append(dds);
                tAcomment.append(dls);
            });
            setTimeout(function(){
                tacInputClick = true;
            },2500);
        }
    }
    else{
        console.log('double');
    }
}
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
