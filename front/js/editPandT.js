let edit = true;
let originalImages;
let changedImages;
window.addEventListener('load', () => {
    const content = document.getElementById('editor').value();
    originalImages = parseImgTags(content);
    console.log(content, originalImages);
});

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

if(edit){
    edit = !edit;
    function postEditArticle(target) {
        const type = target.name;
        const isPublic = document.getElementById('rbP').checked ? 'p' : 'a';
        var content = document.getElementById('editor').value();
        const hashtag = document.getElementById('hashtag').value;
        const thumbnail = document.getElementById('thumbnail').value;
        var deleteImg;
        const req = {
            public: isPublic,
            content: content,
            hashtag: hashtag,
            thumbnail: thumbnail
        };
        if(type === 't') req.question = document.getElementById('question').value;
        else req.title = document.getElementById('title').value;

        const parsed = parseImgTags(content);
        content = parsed.content;

        const imgCount = Object.keys(parsed.imgs).length;
        if(imgCount === 0) finalPost(req);
        else {
            deleteImg = checkImage(parsed.imgs);
            let done = 0;
            for(let id in parsed.imgs) {
                if(parsed.imgs[id].substring(0, 4) === "data"){
                    uploadImage(id, parsed.imgs[id], (id, filename) => {
                        content = replace(content, id, filename);
                        req.content = content;
                        done++;
                        if(done === imgCount){
                            finalPost(req);
                        }
                    });
                }
                else if(parsed.imgs[id].substring(0, 4) === "http"){
                    var fileURL = parsed.imgs[id].split('/');
                    var filename = '';
                    for(var f=0; f<fileURL.length;f++){
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
                    var filePath = parsed.imgs[id].split('/');
                    content = replace(content, id, filePath[1]);
                    req.content = content;
                    done++;
                }

            }
            if(deleteImage.length > 0){
                console.log(deleteImg);
                deleteImage(deleteImg);
            }
            if(done === imgCount){
                finalPost(req);
            }
        }

    }
    setTimeout(function(){
        edit = true;
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
        if(imgIndex === -1) break;
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
    filename = "https://beritamus.s3-ap-southeast-1.amazonaws.com/images/" + filename;
    var s = 0, e = 0;
    while(true) {
        const imgIndex = content.indexOf('<img', index);
        const srcIndex = content.indexOf('src="', imgIndex);
        const endIndex = content.indexOf('"', srcIndex+5);
        if(imgIndex === -1 || srcIndex === -1 || endIndex === -1) break;
        const curId = parseInt(content.substring(srcIndex + 5, endIndex));
        if(curId === id) {
            s = srcIndex + 5;
            e = endIndex;
            break;
        }
        index = endIndex;
    }
    return content.substring(0, s) + filename + content.substring(e);
}

function deleteImage() {
    var xhr = new XMLHttpRequest();
    xhr.open('delete', '/image', true);
    xhr.setRequestHeader('Content-type', "application/json");
    xhr.send(json);
    xhr.onload = () => {
        let result = JSON.parse(xhr.responseText);
        console.log(result);
        console.log('deleted');
    };
}

function finalPost(body) {
    let type;
    let postUrl;
    let articleId = location.pathname.split('/')[3];

    if(body.question) type = 't';
    else type = 'p';

    if(type ==='p') postUrl = 'api/article/penobrol/' + articleId;
    else postUrl = 'api/article/tandya/' + articleId;

    var xhr = new XMLHttpRequest();
    xhr.open('PUT', postUrl, true);
    xhr.setRequestHeader('Content-type', "application/json");
    xhr.withCredentials = true;
    xhr.send(JSON.stringify(body));
    xhr.onload = () => {
        let id = JSON.parse(xhr.responseText).id;
        window.location.href = location.origin + "/penobrol/view/" + id.toString();
    };
}
