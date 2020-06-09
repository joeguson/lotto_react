/* ===== Image functions ===== */
// replace image tag src into uploaded file
function replace(content, id, filename, index = 0) {
    filename = "https://beritamus.s3-ap-southeast-1.amazonaws.com/images/" + filename;
    var s = 0, e = 0;
    while (true) {
        const imgIndex = content.indexOf('<img', index);
        const srcIndex = content.indexOf('src="', imgIndex);
        const endIndex = content.indexOf('"', srcIndex + 5);
        if (imgIndex === -1 || srcIndex === -1 || endIndex === -1) break;
        const curId = content.substring(srcIndex + 5, endIndex);
        if (curId === id) {
            s = srcIndex + 5;
            e = endIndex;
            break;
        }
        index = endIndex;
    }
    return content.substring(0, s) + filename + content.substring(e);
}

// parse image tag src and index them
function parseImgTags(content) {
    let id = 1;
    let imgIndex = 0;

    let imgMaps = {};
    let posMaps = {};

    while (true) {
        // <img
        imgIndex = content.indexOf('<img', imgIndex);
        if (imgIndex === -1) break;
        // src="
        const srcIndex = content.indexOf('src=\"', imgIndex);
        // data
        const dataIndex = srcIndex + 5;
        // ">
        const endIndex = content.indexOf('\">', imgIndex);
        const data = content.substring(dataIndex, endIndex);
        if(data.substring(0,4) != "http"){
            posMaps[id] = {s: dataIndex, e: endIndex};
            imgMaps[id] = data;
            id++;
        }
        imgIndex = endIndex;
    }
    for (--id; id >= 1; id--) {
        const prev = content.substring(0, posMaps[id].s);
        const post = content.substring(posMaps[id].e);
        content = prev + id.toString() + post;
    }
    return {
        content: content,
        imgs: imgMaps
    };
}

function deleteImage() {
    var xhr = new XMLHttpRequest();
    xhr.open('delete', '/image', true);
    xhr.setRequestHeader('Content-type', "application/json");
    xhr.send(json);
    xhr.onload = () => {
        let result = JSON.parse(xhr.responseText);
        console.log(result);
    };
}

function checkImage(imageObject){
    let originalImageName = Object.values(originalImages.imgs);
    let finalImageName = Object.values(imageObject);
    let temp = [];
    var returnImageName = [];
    for(var i=0; i<originalImageName.length; i++){
        var p = 0;
        for(var j=0; j<finalImageName.length;j++){
            if(originalImageName[i] === finalImageName[j]){
                p++;
            }
        }
        if(p < 1){
            temp.push(i);
        }
    }
    for(var k = 0; k<temp.length; k++){
        returnImageName.push(originalImageName[temp[k]]);
    }
    return returnImageName;
}

// upload image and get its filename
function uploadImage(id, data, onUploaded) {
    makeRequest('POST', '/api/image', {img: data})
        .then(res => {
            const filename = JSON.parse(res.toString()).filename;
            onUploaded(id, filename);
        });
}

function preFinalPost(type, submitType, content, req, postFunction){
    const parsed = parseImgTags(content);
    content = parsed.content;
    const imgCount = Object.keys(parsed.imgs).length;
    if(imgCount === 0) finalPost(type, req);
    else{
        let done = 0;
        if(submitType){
            for(let id in parsed.imgs) {
                uploadImage(id, parsed.imgs[id], (id, filename) => {
                    content = replace(content, id, filename);
                    req.content = content;
                    done++;
                    if(done === imgCount)
                        postFunction(type, req);
                });
            }
        }
        else{
            let deleteImg = checkImage(parsed.imgs);
            for(let id in parsed.imgs) {
                if(parsed.imgs[id].substring(0, 4) === "data"){
                    uploadImage(id, parsed.imgs[id], (id, filename) => {
                        content = replace(content, id, filename);
                        req.content = content;
                        done++;
                        if(done === imgCount){
                            postFunction(type, req);
                        }
                    });
                }
                else if(parsed.imgs[id].substring(0, 4) === "http"){
                    let fileURL = parsed.imgs[id].split('/');
                    let filename = '';
                    for(let f=0; f<fileURL.length;f++){
                        if(fileURL[f] === 'images'){
                            filename = fileURL[++f];
                            break;
                        }
                    }
                    content = replace(content, id, filename);
                    req.content = content;
                    done++;
                }
                else{
                    let filePath = parsed.imgs[id].split('/');
                    content = replace(content, id, filePath[1]);
                    req.content = content;
                    done++;
                }
            }
            if(deleteImage.length > 0){
                deleteImage(deleteImg);
            }
            if(done === imgCount){
                postFunction(type, req);
            }
        }
    }
}
