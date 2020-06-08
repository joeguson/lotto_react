let submitType = false;
let start = true;
let originalImages;

//add / edit을 검사하고 edit의 경우 기존의 img를 가지고 있게 됨.
window.addEventListener('load', () => {
    const content = document.getElementById('editor').value();
    //add의 경우 true, edit일 경우 false
    submitType = !content;
    if(!submitType){
        originalImages = parseImgTags(content);
    }
});

function __getIsPublic() {
    const element = document.getElementById("rbP");
    if (element == null) return 'p';
    return element.checked ? 'p' : 'a';
}

function commonStart(target){
    start = !start;
    __createMask();
    __showLoading();

    const mainColumn = document.getElementById('mainColumn').value;
    const isPublic = __getIsPublic();
    const thumbnail = document.getElementById('thumbnail').value;
    const hashtags = document.getElementById('hashtag').value;
    let content = document.getElementById('editor').value();
    let req = {};
    req.type = target.name;
    req.thumbnail = thumbnail;
    req.content = content;
    req.hashtag = hashtags;
    req.public = isPublic;

    if (target.name === 'youtublog') req.youtubes = document.getElementById('editor').youtubes;

    //tandya일 경우 question을, penobrol과 youtublog일 경우 title을 가져옴
    if(target.name === 'tandya') req.question = mainColumn;
    else req.title = mainColumn;

    preFinalPost(target.name, submitType, content, req, finalPost);

    setTimeout(function(){
        start = true;
    },3000);
}

function finalPost(type, body) {
    //add의 경우 true, edit일 경우 false
    let postUrl = 'api/';
    if(submitType){
        switch (type) {
            case 'penobrol': postUrl += 'article/penobrol/';   break;
            case 'tandya': postUrl += 'article/tandya/';     break;
            case 'youtublog': postUrl += 'article/youtublog/';  break;
            default: return;
        }
        makeRequest('POST', postUrl, body)
            .then((res) => {
                let id = JSON.parse(res).id;
                if(type === 'penobrol') window.location.href = location.origin + "/penobrol/" + id.toString();
                else if(type === 'tandya') window.location.href = location.origin + "/tandya/" + id.toString();
                else window.location.href = location.origin + "/youtublog/" + id.toString();
            });
    }
    else{
        let articleId = location.pathname.split('/')[3];
        postUrl += `article/${type}/${articleId}`;
        makeRequest('PUT', postUrl, body)
            .then(res => {
                const id = JSON.parse(res.toString()).id;
                window.location.href = `/${type}/${id}`;
            });
    }
}




// // article을 추가하는 버튼으로써, p-add, t-add, y-add 에서 사용
// // noinspection JSUnusedGlobalSymbols
// function postArticle(target) {
//     __createMask();
//     __showLoading();
//
//     const type = target.name;
//     let content = document.getElementById('editor').value();
//     let req = {};
//     req.content = content;
//     if(type === 'a'){
//         req.type = type;
//         req.articleId = location.href.split('/')[4];
//     }
//     else{
//         const isPublic = __getIsPublic();
//         const hashtag = document.getElementById('hashtag').value;
//         const thumbnail = document.getElementById('thumbnail').value;
//
//         req.type = type;
//         req.thumbnail = thumbnail;
//         req.public = isPublic;
//         req.hashtag = hashtag;
//
//         if (type === 'y') req.youtubes = document.getElementById('editor').youtubes;
//
//         //tandya일 경우 question을, penobrol과 youtublog일 경우 title을 가져옴
//         if(type === 't') req.question = document.getElementById('question').value;
//         else req.title = document.getElementById('title').value;
//     }
//     const parsed = parseImgTags(content);
//     content = parsed.content;
//     const imgCount = Object.keys(parsed.imgs).length;
//     if(imgCount === 0) finalPost(req);
//     else {
//         let done = 0;
//         for(let id in parsed.imgs) {
//             uploadImage(id, parsed.imgs[id], (id, filename) => {
//                 content = replace(content, id, filename);
//                 req.content = content;
//                 done++;
//                 if(done === imgCount)
//                     finalPost(req);
//             });
//         }
//     }
// }
// setTimeout(function(){
//     add = true;
// },2000);

// function finalPost(type, body) {
//     let postUrl = 'api/';
//     switch (body.type) {
//         case 'p': postUrl += 'article/penobrol/';   break;
//         case 't': postUrl += 'article/tandya/';     break;
//         case 'y': postUrl += 'article/youtublog/';  break;
//         case 'a': postUrl += 'reply/'+body.articleId;  break;
//         default: return;
//     }
//     let xhr = new XMLHttpRequest();
//     xhr.open('POST', postUrl, true);
//     xhr.setRequestHeader('Content-type', "application/json");
//     xhr.withCredentials = true;
//     xhr.send(JSON.stringify(body));
//     xhr.onload = () => {
//         let id = JSON.parse(xhr.responseText).id;
//         if(body.type === 'p') window.location.href = location.origin + "/penobrol/" + id.toString();
//         else if(body.type === 't') window.location.href = location.origin + "/tandya/" + id.toString();
//         else if(body.type ==='y') window.location.href = location.origin + "/youtublog/" + id.toString();
//         else window.location.href = location.origin + "/tandya/" + body.articleId;
//     };
// }


//editArticle 원본
// let edit = true;
// let originalImages;
// let changedImages;
//
// window.addEventListener('load', () => {
//     const content = document.getElementById('editor').value();
//     originalImages = parseImgTags(content);
// });
//
// function checkImage(imageObject){
//     let originalImageName = Object.values(originalImages.imgs);
//     let finalImageName = Object.values(imageObject);
//     let temp = [];
//     var returnImageName = [];
//     for(var i=0; i<originalImageName.length; i++){
//         var p = 0;
//         for(var j=0; j<finalImageName.length;j++){
//             if(originalImageName[i] === finalImageName[j]){
//                 p++;
//             }
//         }
//         if(p < 1){
//             temp.push(i);
//         }
//     }
//     for(var k = 0; k<temp.length; k++){
//         returnImageName.push(originalImageName[temp[k]]);
//     }
//     return returnImageName;
// }
//
// if(edit){
//     edit = !edit;
//     function postEditArticle(type) {
//         __createMask();
//         __showLoading();
//         const isPublic = document.getElementById('rbP').checked ? 'p' : 'a';
//         let content = document.getElementById('editor').value();
//         const hashtag = document.getElementById('hashtag').value;
//         const thumbnail = document.getElementById('thumbnail').value;
//         var deleteImg;
//         const req = {
//             public: isPublic,
//             content: content,
//             hashtag: hashtag,
//             thumbnail: thumbnail
//         };
//
//         switch (type) {
//             case 'penobrol':
//             case 'youtublog':
//                 req.title = document.getElementById('mainColumn').value;
//                 break;
//             case 'tandya':
//                 req.question = document.getElementById('mainColumn').value;
//                 break;
//             default:
//                 return;
//         }
//
//         const parsed = parseImgTags(content);
//         content = parsed.content;
//
//         const imgCount = Object.keys(parsed.imgs).length;
//         if(imgCount === 0) finalPost(type, req);
//         else {
//             deleteImg = checkImage(parsed.imgs);
//             let done = 0;
//             for(let id in parsed.imgs) {
//                 if(parsed.imgs[id].substring(0, 4) === "data"){
//                     uploadImage(id, parsed.imgs[id], (id, filename) => {
//                         content = replace(content, id, filename);
//                         req.content = content;
//                         done++;
//                         if(done === imgCount){
//                             finalPost(type, req);
//                         }
//                     });
//                 }
//                 else if(parsed.imgs[id].substring(0, 4) === "http"){
//                     var fileURL = parsed.imgs[id].split('/');
//                     var filename = '';
//                     for(var f=0; f<fileURL.length;f++){
//                         if(fileURL[f] === 'images'){
//                             filename = fileURL[++f];
//                             break;
//                         }
//                     }
//                     content = replace(content, id, filename);
//                     req.content = content;
//                     done++;
//                 }
//                 else{
//                     var filePath = parsed.imgs[id].split('/');
//                     content = replace(content, id, filePath[1]);
//                     req.content = content;
//                     done++;
//                 }
//
//             }
//             if(deleteImage.length > 0){
//                 deleteImage(deleteImg);
//             }
//             if(done === imgCount){
//                 finalPost(type, req);
//             }
//         }
//
//     }
//     setTimeout(function(){
//         edit = true;
//     },2000);
// }
//
// function deleteImage() {
//     var xhr = new XMLHttpRequest();
//     xhr.open('delete', '/image', true);
//     xhr.setRequestHeader('Content-type', "application/json");
//     xhr.send(json);
//     xhr.onload = () => {
//         let result = JSON.parse(xhr.responseText);
//         console.log(result);
//     };
// }
//
// function finalPost(type, body) {
//     let articleId = location.pathname.split('/')[3];
//
//     const postUrl = `api/article/${type}/${articleId}`;
//
//     makeRequest('PUT', postUrl, body)
//         .then(res => {
//             const id = JSON.parse(res.toString()).id;
//             window.location.href = `/${type}/${id}`;
//         });
// }


