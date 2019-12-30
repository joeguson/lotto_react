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
    xhr.open('POST', '/image', true);
    xhr.setRequestHeader('Content-type', "application/json");
    xhr.send(json);
    xhr.onload = () => {
        var result = JSON.parse(xhr.responseText).filename;
        onUploaded(id, result);
    };
}
function replace(content, id, filename, index = 0) {
    filename = "./" + filename;
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
