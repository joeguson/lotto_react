var pcctacInputClick = true;
function pcacSendAjax(target){
    const pathname = location.pathname;
    const type = pathname.split('/')[1];
    const ptid = pathname.split('/')[2];
    const pctaId = target.name;
    let original = {'pcctacContent' : target.previousSibling.previousSibling.value};
    if(pcctacInputClick){
        pcctacInputClick = !pcctacInputClick;
        if(target.previousSibling.previousSibling.value.length < 5){
            alert('needs to be longer than 5 letters');
            setTimeout(function(){
                pcctacInputClick = true;
            },1500);
        }
        else{
            original = JSON.stringify(original);
            const xhr = new XMLHttpRequest();
            let postUrl = '';
            if(type === 'penobrol') postUrl = '/api/penobrol/ccomment/'+ptid+'/'+pctaId;
            else postUrl = '/api/tandya/acomment/'+ptid+'/'+pctaId;
            xhr.open('POST', postUrl);
            xhr.setRequestHeader('Content-type', "application/json");
            xhr.send(original);
            // 데이터 수신이 완료되면 표시
            xhr.addEventListener('load', function(){
                const result = JSON.parse(xhr.responseText);
                let pcta = '';
                let dls = document.createElement('dl');
                let dts = document.createElement('dt');
                let dds = document.createElement('dd');
                let pcctacPopButton = document.createElement('div');
                let pcctacPopDiv = document.createElement('div');
                let warnButton = document.createElement('button');
                let deleteButton = document.createElement('button');
                let warnImg = document.createElement('img');
                let deleteImg = document.createElement('img');
                dls.setAttribute('class', 'dlPccAndTac');
                dts.setAttribute('class', 'dtPccAndTac');
                dds.setAttribute('class', 'ddPccAndTac');
                pcctacPopButton.setAttribute('class', 'pcctacPopButton');
                pcctacPopButton.setAttribute('onclick', 'pcctacMenuButton(this)');
                pcctacPopButton.innerHTML = '≡';
                pcctacPopDiv.setAttribute('class', 'pcctacPopDiv');
                warnButton.setAttribute('class', 'pcctacPopMenu');
                deleteButton.setAttribute('class', 'pcctacPopMenu');
                warnButton.setAttribute('onclick', 'warningArticle(this);');
                warnImg.setAttribute('src', './icons/warn.png');
                deleteImg.setAttribute('src', './icons/trash.png');
                warnButton.append(warnImg);
                deleteButton.append(deleteImg);
                pcctacPopDiv.append(warnButton);
                pcctacPopDiv.append(deleteButton);
                pcctacPopButton.append(pcctacPopDiv);
                if(type ==='penobrol'){
                    pcta = document.getElementById("pc/" + ptid + '/' + pctaId);
                    console.log(pcta);
                    pcctacPopDiv.setAttribute('id', result.ccomment_id);
                    warnButton.setAttribute('value', 'p/pcc/'+result.ccomment_id);
                    deleteButton.setAttribute('value', result.ccomment_id);
                    deleteButton.setAttribute('onclick', 'postDeletePccomment(this)');
                    dts.innerHTML = '- "' +result.ccomment_content+'"';
                    dds.innerHTML = 'by '+result.ccomment_author+' / '+ datemaker(result.ccomment_date);
                }
                else{
                    pcta = document.getElementById("ta/" + ptid + '/' + pctaId);
                    pcctacPopDiv.setAttribute('id', result.acomment_id);
                    warnButton.setAttribute('value', 't/tac/'+result.acomment_id);
                    deleteButton.setAttribute('value', result.acomment_id);
                    deleteButton.setAttribute('onclick', 'postDeleteTacomment(this)');
                    dts.innerHTML = '- "' +result.acomment_content+'"';
                    dds.innerHTML = 'by '+result.acomment_author+' / '+ datemaker(result.acomment_date);
                }
                target.previousSibling.previousSibling.value = '';
                dts.append(pcctacPopButton);
                dls.append(dts);
                dls.append(dds);
                pcta.append(dls);
            });
            setTimeout(function(){
                pcctacInputClick = true;
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
