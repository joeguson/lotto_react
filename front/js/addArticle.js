function __getIsPublic() {
    const element = document.getElementById("rbP");
    if (element == null) return 'p';
    return element.checked ? 'p' : 'a';
}

// article을 추가하는 버튼으로써, p-add, t-add, y-add 에서 사용
// noinspection JSUnusedGlobalSymbols
function postArticle(target) {
    __createMask();
    __showLoading();
    const type = target.name;
    const isPublic = __getIsPublic();
    let content = document.getElementById('editor').value();
    const hashtag = document.getElementById('hashtag').value;
    const thumbnail = document.getElementById('thumbnail').value;
    const req = {
        type: type,
        thumbnail: thumbnail,
        public: isPublic,
        content: content,
        hashtag: hashtag
    };

    if (type === 'y') req.youtubes = document.getElementById('editor').youtubes;

    //tandya일 경우 question을, penobrol과 youtublog일 경우 title을 가져옴
    if(type === 't') req.question = document.getElementById('question').value;
    else req.title = document.getElementById('title').value;

    const parsed = parseImgTags(content);
    content = parsed.content;

    const imgCount = Object.keys(parsed.imgs).length;
    if(imgCount === 0) finalPost(req);
    else {
        let done = 0;
        for(let id in parsed.imgs) {
            console.log(parsed.imgs);
            uploadImage(id, parsed.imgs[id], (id, filename) => {
                content = replace(content, id, filename);
                req.content = content;
                done++;
                if(done === imgCount)
                    finalPost(req);
            });
        }
    }
}
setTimeout(function(){
    add = true;
},2000);

function finalPost(body) {
    let postUrl = 'api/article/';
    switch (body.type) {
        case 'p': postUrl += 'penobrol/';   break;
        case 't': postUrl += 'tandya/';     break;
        case 'y': postUrl += 'youtublog/';  break;
        default: return;
    }

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

function __createMask(){
    const maskDiv = document.createElement('div');
    const body = document.getElementsByTagName('body');
    maskDiv.style.backgroundColor = "white";
    maskDiv.style.position = "absolute";
    maskDiv.style.top = "0";
    maskDiv.style.right = "0";
    maskDiv.style.bottom = "0";
    maskDiv.style.left = "0";
    maskDiv.style.float = "left";
    maskDiv.style.width = "100%";
    maskDiv.style.height = body[0].scrollHeight + 'px';
    maskDiv.style.opacity = ".8";
    maskDiv.style.zIndex = "5";
    body[0].appendChild(maskDiv);
}

function __showLoading(){
    const loadDiv = document.createElement('div');
    const body = document.getElementsByTagName('body');
    loadDiv.style.position = "fixed";
    loadDiv.style.top = "35%";
    loadDiv.style.right = "45%";
    loadDiv.style.border = "10px solid #f3f3f3";
    loadDiv.style.zIndex = "6";
    loadDiv.style.borderRadius = "50%";
    loadDiv.style.borderTop = "10px solid #0f4c81";
    loadDiv.style.width = "80px";
    loadDiv.style.height = "80px";
    loadDiv.style.animation = "spin 2s linear infinite";
    loadDiv.style.webkitAnimation = "spin 2s linear infinite";

    body[0].appendChild(loadDiv);
}
