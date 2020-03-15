var pcctacInputClick = true;
function pcacSendAjax(target){
    const pathname = location.pathname;
    const type = pathname.split('/')[1];
    const ptid = pathname.split('/')[2];
    const pctaId = target.name;

    const id = pctaId;
    const content = target.previousSibling.previousSibling["value"];

    let original = {
        id: id,
        content: content
    };
    if(pcctacInputClick){
        pcctacInputClick = !pcctacInputClick;
        if(target.previousSibling.previousSibling.value.length < 5){
            alert('needs to be longer than 5 letters');
            setTimeout(function(){
                pcctacInputClick = true;
            },1500);
        }
        else{
            let postUrl = '/api/article/';
            switch (type) {
                case 'penobrol':  postUrl += 'penobrol/'; break;
                case 'tandya':    postUrl += 'tandya/'; break;
                case 'youtublog': postUrl += 'youtublog/'; break;
                default: return;
            }
            postUrl += 're-reply/';

            makeRequest('POST', postUrl, original)
                .then(res => {
                    const result = JSON.parse(res.toString());

                    console.log(result);

                    let pcta;
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
                        pcctacPopDiv.setAttribute('id', id);
                        warnButton.setAttribute('value', 'p/pcc/'+id);
                        deleteButton.setAttribute('value', id);
                        deleteButton.setAttribute('onclick', 'postDeletePccomment(this)');
                        dts.innerHTML = '- "' + content + '"';
                        dds.innerHTML = 'by ' + result.author + ' / just now';
                    }
                    else{
                        pcta = document.getElementById("ta/" + ptid + '/' + pctaId);
                        pcctacPopDiv.setAttribute('id', id);
                        warnButton.setAttribute('value', 't/tac/'+id);
                        deleteButton.setAttribute('value', id);
                        deleteButton.setAttribute('onclick', 'postDeleteTacomment(this)');
                        dts.innerHTML = '- "' +content+'"';
                        dds.innerHTML = 'by '+result.author + ' / just now';
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
