let submitType = false;
let start = true;
let originalImages;

//add / edit을 검사하고 edit의 경우 기존의 img를 가지고 있게 됨.
window.addEventListener('load', () => {
    const content = document.getElementById('editor').value();
    //add의 경우 true, edit일 경우 false
    submitType = !content;
    if(!submitType){
        const content = document.getElementById('editor').value();
        originalImages = parseImgTags(content);
    }
});

function commonStart(target){
    start = !start;
    __createMask();
    __showLoading();

    let content = document.getElementById('editor').value();

    let req = {};
    req.content = content;
    req.type = target.name;
    req.articleId = location.pathname.split('/')[4];

    preFinalPost(target.name, submitType, content, req, finalPost);

    setTimeout(function(){
        edit = true;
    },3000);
}

function finalPost(type, body) {
    //add의 경우 true, edit일 경우 false
    let postUrl = 'api/reply/';
    if(submitType){
        postUrl += body.articleId;
        makeRequest('POST', postUrl, body)
            .then((res) => {
                window.location.href = location.origin + '/'+body.type + '/'+body.articleId;
            });
    }
    else{
        postUrl += type + '/'+ body.articleId + '/'+location.pathname.split('/')[5];
        makeRequest('PUT', postUrl, body)
            .then(res => {
                const id = JSON.parse(res.toString()).id;
                window.location.href = location.origin + '/'+body.type + '/'+body.articleId;
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


