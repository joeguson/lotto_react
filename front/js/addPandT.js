let add = true;
if(add){
    add = !add;
    function postArticle(target) {
        const type = target.name;
        const public = document.getElementById('rbP').checked ? 'p' : 'a';
        var content = document.getElementById('editor').value();
        const hashtag = document.getElementById('hashtag').value;
        const thumbnail = document.getElementById('thumbnail').value;
        const req = {
            type: type,
            thumbnail: thumbnail,
            public: public,
            content: content,
            hashtag: hashtag
        };
        //tandya일 경우 question을, penobrol과 youtublog일 경우 title을 가져옴
        if(type == 't') req.question = document.getElementById('question').value;
        else req.title = document.getElementById('title').value;

        const parsed = parseImgTags(content);
        content = parsed.content;

        const imgCount = Object.keys(parsed.imgs).length;
        if(imgCount == 0) finalPost(req);
        else {
            var done = 0;
            for(var id in parsed.imgs) {
                uploadImage(id, parsed.imgs[id], (id, filename) => {
                    console.log(req);
                    content = replace(content, id, filename);
                    req.content = content;
                    done++;
                    if(done == imgCount)
                        finalPost(req);
                });
            }
        }
    }
    setTimeout(function(){
        add = true;
    },2000);
}

function parseImgTags(content) {
    var id = 1;
    var imgIndex = 0;

    var imgMaps = {};
    var posMaps = {};

    while(true) {
        // <img
        imgIndex = content.indexOf('<img', imgIndex);
        if(imgIndex == -1) break;
        // src="
        const srcIndex = content.indexOf('src=\"', imgIndex);
        // data
        const dataIndex = srcIndex + 5;
        // ">
        const endIndex = content.indexOf('\">', imgIndex);
        const data = content.substring(dataIndex, endIndex);
        posMaps[id] = {s: dataIndex, e: endIndex};
        imgMaps[id] = data;
        id++;
        imgIndex = endIndex;
    }
    for(--id; id >= 1; id--) {
        const prev = content.substring(0, posMaps[id].s);
        const post = content.substring(posMaps[id].e);
        content = prev + id.toString() + post;
    }
    return {
        content: content,
        imgs: imgMaps
    };
}

function uploadImage(id, data, onUploaded) {
    var json = JSON.stringify({
       img: data
    });
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/image', true);
    xhr.setRequestHeader('Content-type', "application/json");
    xhr.send(json);
    xhr.onload = () => {
        var result = JSON.parse(xhr.responseText).filename;
        onUploaded(id, result);
    };
}

function replace(content, id, filename, index = 0) {
    filename = "https://beritamus.s3-ap-southeast-1.amazonaws.com/images/" + filename;
    var s = 0, e = 0;
    while(true) {
        const imgIndex = content.indexOf('<img', index);
        const srcIndex = content.indexOf('src="', imgIndex);
        const endIndex = content.indexOf('"', srcIndex+5);
        if(imgIndex == -1 || srcIndex == -1 || endIndex == -1) break;
        const curId = parseInt(content.substring(srcIndex + 5, endIndex));
        if(curId == id) {
            s = srcIndex + 5;
            e = endIndex;
            break;
        }
        index = endIndex;
    }
    return content.substring(0, s) + filename + content.substring(e);
}

function finalPost(body) {
    let postUrl = '';
    if(body.type ==='p') postUrl = 'api/penobrol';
    else if(body.type === 't') postUrl = 'api/tandya';
    else postUrl = 'api/youtublog';
    let xhr = new XMLHttpRequest();
    xhr.open('POST', postUrl, true);
    xhr.setRequestHeader('Content-type', "application/json");
    xhr.withCredentials = true;
    xhr.send(JSON.stringify(body));
    xhr.onload = () => {
        let id = JSON.parse(xhr.responseText).id;
        if(body.type === 'p') window.location.href = location.origin + "/penobrol/" + id.toString();
        else if(body.type === 't') window.location.href = location.origin + "/tandya/" + id.toString();
        else window.location.href = location.origin + "/youtublog/" + id.toString();
    };
}

function makeTimeJumper(timeTag){
    let result = [];
    let youtubeTimeList = timeTag.getElementsByTagName('b-youtube-time');
    //getElementsByTagName returns htmlCollection which is not an array. Map function does not work for below
    for(let i = 0; i<youtubeTimeList.length; i++){
        let timeObj = {};
        timeObj.h = youtubeTimeList[i].children[0].value;
        timeObj.m = youtubeTimeList[i].children[1].value;
        timeObj.s = youtubeTimeList[i].children[2].value;
        timeObj.d = youtubeTimeList[i].children[3].value;
        result.push(timeObj);
    }
    return result;
}

function makeTimeTable(timeObj, youtubeId){
    const table = document.createElement('table');
    for(let i = 0; i<timeObj.length; i++){
        let tempRow = document.createElement('tr');
        let temp1 = document.createElement('td');
        let temp2 = document.createElement('td');

        let buttonTag = document.createElement('button');
        let spanTag = document.createElement('span');

        buttonTag.innerHTML = timeObj[i].h + timeObj[i].m + timeObj[i].s;
        buttonTag.setAttribute('value', youtubeId);
        buttonTag.setAttribute('onclick', 'changeStartTime(this);');

        spanTag.innerHTML = timeObj[i].d;
        temp1.appendChild(buttonTag);
        temp2.appendChild(spanTag);

        tempRow.append(temp1);
        tempRow.append(temp2);
        table.appendChild(tempRow);
    }
    return table.outerHTML;
}
