let edit = true;
let originalImages;
let changedImages;
window.addEventListener('load', () => {
    const content = document.getElementById('editor').value();
    originalImages = parseImgTags(content);
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
