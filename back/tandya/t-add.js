
function postTandyaAdd() {
    const question = document.getElementById('question').value;
    const public = document.getElementById('rbP').checked ? 'p' : 'a';
    var content = document.getElementById('editor').value();
    const hashtag = document.getElementById('hashtag').value;

    const req = {
        question: question,
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
            uploadImage(id, parsed.imgs[id], (id, filename) => {
            content = replace(content, id, filename);
            req.content = content;
            done++;
            if(done == imgCount)
                finalPost(req);
        });
    }
    }
}

function finalPost(body) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/tandya/add', true);
    xhr.setRequestHeader('Content-type', "application/json");
    xhr.withCredentials = true;
    xhr.send(JSON.stringify(body));
    xhr.onload = () => {
        var id = JSON.parse(xhr.responseText).id;
        window.location.href = location.origin + "/tandya/" + id.toString();
    };
}