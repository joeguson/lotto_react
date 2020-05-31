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
    let content = document.getElementById('editor').value();
    let req = {};
    req.content = content;
    if(type === 'a'){
        req.type = type;
        req.articleId = location.href.split('/')[4];
    }
    else{
        const isPublic = __getIsPublic();
        const hashtag = document.getElementById('hashtag').value;
        const thumbnail = document.getElementById('thumbnail').value;

        req.type = type;
        req.thumbnail = thumbnail;
        req.public = isPublic;
        req.hashtag = hashtag;

        if (type === 'y') req.youtubes = document.getElementById('editor').youtubes;

        //tandya일 경우 question을, penobrol과 youtublog일 경우 title을 가져옴
        if(type === 't') req.question = document.getElementById('question').value;
        else req.title = document.getElementById('title').value;
    }
    const parsed = parseImgTags(content);
    content = parsed.content;
    const imgCount = Object.keys(parsed.imgs).length;
    if(imgCount === 0) finalPost(req);
    else {
        let done = 0;
        for(let id in parsed.imgs) {
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
    let postUrl = 'api/';
    switch (body.type) {
        case 'p': postUrl += 'article/penobrol/';   break;
        case 't': postUrl += 'article/tandya/';     break;
        case 'y': postUrl += 'article/youtublog/';  break;
        case 'a': postUrl += 'reply/'+body.articleId;  break;
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
        else if(body.type ==='y') window.location.href = location.origin + "/youtublog/" + id.toString();
        else window.location.href = location.origin + "/tandya/" + body.articleId;
    };
}
