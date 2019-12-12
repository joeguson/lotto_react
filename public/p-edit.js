var originalImages;
var changedImages;
window.onload= () => {
    var content = document.getElementById('editor').value();
    var originalImages = parseImgTags(content);
    console.log(originalImages.imgs);
}

function postEditPenobrol() {
    const title = document.getElementById('title').value;
    const public = document.getElementById('rbP').checked ? 'p' : 'a';
    var content = document.getElementById('editor').value();
    const hashtag = document.getElementById('hashtag').value;
    const req = {
        title: title,
        public: public,
        content: content,
        hashtag: hashtag
    };
    const parsed = parseImgTags(content);
    content = parsed.content;
    const imgCount = Object.keys(parsed.imgs).length;
    if(imgCount == 0) finalPost(req);
    else {
        var done = 0;
        for(var id in parsed.imgs) {
            if(binary){
                uploadImage(id, parsed.imgs[id], (id, filename) => {
                    content = replace(content, id, filename);
                    req.content = content;
                    done++;
                    if(done == imgCount){
                        finalPost(req);
                    }
                });
            }
        }
    }
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
    console.log(imgMaps);
    return {
        content: content,
        imgs: imgMaps
    };
}

function uploadImage(id, data, onUploaded) {
    var content = location.pathname.split("/");
    var json = JSON.stringify({
        img: data,
        content_type: 'p',
        content_id: content[2]
    });
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/reimage', true);
    xhr.setRequestHeader('Content-type', "application/json");
    xhr.send(json);
    xhr.onload = () => {
        var result = JSON.parse(xhr.responseText).filename;
        onUploaded(id, result);
    };
}

function replace(content, id, filename, index = 0) {
    filename = "images/" + filename;
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
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/pedit/:penobrol_no', true);
    xhr.setRequestHeader('Content-type', "application/json");
    xhr.withCredentials = true;
    xhr.send(JSON.stringify(body));
    xhr.onload = () => {
        var id = JSON.parse(xhr.responseText).id;
        window.location.href = location.origin + "/penobrol/" + id.toString();
    };
}