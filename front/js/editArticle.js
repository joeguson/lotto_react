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
    function postEditArticle(type) {
        const isPublic = document.getElementById('rbP').checked ? 'p' : 'a';
        let content = document.getElementById('editor').value();
        const hashtag = document.getElementById('hashtag').value;
        const thumbnail = document.getElementById('thumbnail').value;
        var deleteImg;
        const req = {
            public: isPublic,
            content: content,
            hashtag: hashtag,
            thumbnail: thumbnail
        };

        switch (type) {
            case 'penobrol':
            case 'youtublog':
                req.title = document.getElementById('mainColumn').value;
                break;
            case 'tandya':
                req.question = document.getElementById('mainColumn').value;
                break;
            default:
                return;
        }

        const parsed = parseImgTags(content);
        content = parsed.content;

        const imgCount = Object.keys(parsed.imgs).length;
        if(imgCount === 0) finalPost(type, req);
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
                            finalPost(type, req);
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
                finalPost(type, req);
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

function finalPost(type, body) {
    let articleId = location.pathname.split('/')[3];

    const postUrl = `api/article/${type}/${articleId}`;

    makeRequest('PUT', postUrl, body)
        .then(res => {
            const id = JSON.parse(res.toString()).id;
            window.location.href = `/${type}/${id}`;
        });
}
