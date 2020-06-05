/* ====== Post Reply ====== */

window.addEventListener('load', function(){
    const replySubmitButton = document.getElementById("replySubmitButton");
    if(replySubmitButton){
        replySubmitButton.onclick = function(){
            let newReply = {};
            const replyInput = document.getElementById('replyInput');
            const replyContent = replyInput.value;
            const articleType = (location.pathname).split('/')[1];
            const articleId = (location.pathname).split('/')[2];
            let ajaxReplyLi = ajaxReply(replyContent);
            newReply.type = articleType;
            newReply.content = replyContent;
            newReply.articleId = articleId;
            makeRequest('POST', 'api/reply/'+articleId, newReply)
                .then(result => {
                    replyInput.value = '';
                    const tempReply = document.getElementById(ajaxReplyLi);
                    tempReply.remove();
                    const parsedResult = JSON.parse(result);
                    createReply(parsedResult.reply, parsedResult.type, parsedResult.userId);
                });
        };
    }
});

/* ====== Create Ajax Reply ====== */
function ajaxReply(content){
    const replyUl = document.getElementById('replyUl');
    const replyLi = document.createElement('li');
    replyLi.id = 'ab';
    //inside replyLi
    const replyDl = document.createElement('dl');
    {
        replyDl.className = "replyDl";
        //inside replyDl
        const replyDt = document.createElement('dt');
        {
            //inside replyDt
            const replyPre = document.createElement('pre');
            replyPre.className = "pcomment-dt";
            replyPre.innerHTML = content;
            replyDt.appendChild(replyPre);
        }
        replyDl.appendChild(replyDt);
    }
    replyLi.appendChild(replyDl);
    replyUl.appendChild(replyLi);
    return 'ab';
}

/* ====== Create Chosen Reply ====== */
function createChosenReply(reply, type, userId, articleAuthor){
    const replyChosen = document.getElementById('replyChosen');
    replyChosen.appendChild(createReplyLi(reply, type, userId, articleAuthor));
}


/* ====== Create Reply ====== */
function createReply(reply, type, userId, articleAuthor){
    const replyUl = document.getElementById('replyUl');
    replyUl.appendChild(createReplyLi(reply, type, userId, articleAuthor));
}

/* ====== Create Reply Li ====== */
function createReplyLi(reply, type, userId, articleAuthor){
    // a reply is built in a li tag
    const replyLi = document.createElement('li');
    replyLi.className = "replyLi";
    replyLi.id = "replyLi"+reply.id;
    {
        //inside replyLi
        const replyDl = document.createElement('dl');
        replyDl.className="replyDl";
        {
            //inside replyDl
            {
                const replyDt = document.createElement('dt');
                replyDt.className = "replyDt";
                {
                    //inside replyDt
                    {
                        const replyPre = document.createElement('pre');
                        replyPre.className = "replyPre";
                        type === 'tandya' ? replyPre.innerHTML = `${reply.answer}` : replyPre.innerHTML = `${reply.content}`;
                        replyDt.appendChild(replyPre);
                    }
                }
                replyDl.appendChild(replyDt);
                const replyDd = document.createElement('dd');
                replyDd.className = "replyDd";
                {
                    //inside replyDd
                    const replyInfo = document.createElement('span');
                    replyInfo.className = "replySpan1";
                    replyInfo.innerHTML = 'by ' + `${reply.u_id}` + ' | ' + `${reply.date}` + ' |  ';

                    const replyLikeNum = document.createElement('span');
                    replyLikeNum.className = "replySpan2";
                    replyLikeNum.id = 'likeNum' + reply.id;
                    replyLikeNum.innerHTML = reply.likeCount < 2 ? reply.likeCount + ' highlight  ' : reply.likeCount + ' highlights  ';

                    replyDd.appendChild(replyInfo);
                    replyDd.appendChild(replyLikeNum);
                }
                replyDl.appendChild(replyDd);
            }
        }
        replyLi.appendChild(replyDl);
        if(userId) replyLi.appendChild(createReplyButton(userId, articleAuthor, reply, type));
    }
    return replyLi;
}


/* ====== Create Menu Button ====== */
function createReplyButton(userId, articleAuthor, content, type){
    const replyButtonContainer = document.createElement('div');
    replyButtonContainer.className = 'replyButtonContainer';
    {
        //inside replyButtonContainer
        //1. likeButton
        const replyLikeSpan= document.createElement('span');
        replyLikeSpan.className = "replyButtonSpan";
        {
            //inside replyLikeSpan
            const replyLikeButton= document.createElement('button');
            const replyLikeImg= document.createElement('img');
            replyLikeButton.className = "replyButton";
            replyLikeImg.className = "replyButtonImg";
            replyLikeButton.type = "submit";
            replyLikeButton.value = content.id;
            replyLikeButton.onclick = () =>{
                const likeTarget= document.getElementById('likeNum'+content.id);
                if(content.likeStatus){
                    likeTarget.innerHTML = parseInt(likeTarget.innerHTML)-1 < 2 ? parseInt(likeTarget.innerHTML)-1 +' highlight  ' : parseInt(likeTarget.innerHTML)-1 +' highlights  ';
                    replyLikeImg.src = location.origin +'/icons/highlight.png';
                }
                else{
                    likeTarget.innerHTML = parseInt(likeTarget.innerHTML)+1 < 2 ? parseInt(likeTarget.innerHTML)+1 +' highlight  ' : parseInt(likeTarget.innerHTML)+1 +' highlights  ';
                    replyLikeImg.src = location.origin +'/icons/highlight_ed.png';
                }
                //이후에 ajax 요청을 보냄
                let data = {
                    "id": content.id,
                    "cancel": content.likeStatus
                };
                content.likeStatus = !content.likeStatus;
                makeRequest('POST', 'api/like/' + type + '/reply', data)
                    .then(function (e) {
                        e = JSON.parse(e);
                    });
            };

            (content.likeStatus) ? replyLikeImg.src = location.origin +'/icons/highlight_ed.png' : replyLikeImg.src = location.origin +'/icons/highlight.png';
            replyLikeButton.appendChild(replyLikeImg);
            replyLikeSpan.appendChild(replyLikeButton);
        }
        replyButtonContainer.appendChild(replyLikeSpan);
        //2. WarnButton
        const replyWarnSpan= document.createElement('span');
        replyWarnSpan.className = "replyButtonSpan";
        {
            //inside replyWarnSpan
            const warnButton = document.createElement('button');
            warnButton.className = "replyButton";
            const warnImg= document.createElement('img');
            warnImg.className = "replyButtonImg";
            warnImg.src = location.origin +'/icons/warn.png';
            warnButton.onclick = () => {
                if(confirm("Are you sure to warn this content?")){
                    if(type==='penobrol') warnPenobrolCom(content.id);
                    else if(type==='tandya') warnTandyaAns(content.id);
                    else if(type==='youtublog') warnYoutublogCom(content.id);
                }
                else{
                    alert('not warned');
                }
            };
            warnButton.appendChild(warnImg);
            replyWarnSpan.appendChild(warnButton);
        }
        replyButtonContainer.appendChild(replyWarnSpan);
        if(userId === content.author) {
            //3. deleteButton
            const replyDeleteSpan = document.createElement('span');
            replyDeleteSpan.className = "replyButtonSpan";
            {
                //inside replyDeleteSpan
                const deleteButton = document.createElement('button');
                deleteButton.className = 'replyButton';
                const deleteImg= document.createElement('img');
                deleteImg.src = location.origin +'/icons/trash.png';
                deleteImg.className = 'replyButtonImg';
                deleteButton.onclick = () => {
                    if(type==='penobrol') deletePenobrolCom(content.id);
                    else if(type==='tandya') deleteTandyaAns(content.id);
                    else if(type==='youtublog') deleteYoutublogCom(content.id);
                };
                deleteButton.appendChild(deleteImg);
                replyDeleteSpan.appendChild(deleteButton);
            }
            replyButtonContainer.appendChild(replyDeleteSpan);
            //4. editButton
            const replyEditSpan = document.createElement('span');
            replyEditSpan.className = "replyButtonSpan";
            {
                //inside replyEditSpan
                const editA = document.createElement('a');
                editA.className="replyButton";
                if(type==='penobrol') editA.href = type+'/edit/comment/'+content.p_id+'/'+content.id;
                else if(type==='tandya') editA.href = type+'/edit/answer/'+content.t_id+'/'+content.id;
                else if(type==='youtublog') editA.href = type+'/edit/comment/'+content.y_id+'/'+content.id;
                const editImg= document.createElement('img');
                editImg.src = location.origin +'/icons/edit.png';
                editImg.className = 'replyButtonImg';
                editA.appendChild(editImg);
                replyEditSpan.appendChild(editA);
            }
            replyButtonContainer.appendChild(replyEditSpan);
        }
        if(userId === articleAuthor){
            //5. chosenButton
            const replyChosenSpan = document.createElement('span');
            replyChosenSpan.className = "replyButtonSpan";
            {
                //chosen
                const chosenButton = document.createElement('button');
                chosenButton.className = "replyButton";
                const chosenImg= document.createElement('img');
                chosenImg.src = location.origin +'/icons/check.png';
                chosenImg.className = 'replyButtonImg';
                chosenButton.onclick = () => {
                    __chooseFunc(type, content.id);
                };
                chosenButton.appendChild(chosenImg);
                replyChosenSpan.appendChild(chosenButton);
            }
            replyButtonContainer.appendChild(replyChosenSpan);
        }
    }
    return replyButtonContainer;
}

/* ====== Create Re-reply Input ======= */
// function createReReplyInput(reply, type){
//     const re_replyDiv = document.createElement('div');
//     re_replyDiv.className = "rereplyContainer";
//     //inside re_replyDiv
//     const re_replyTextarea = document.createElement('textarea');
//     const re_replySubmit = document.createElement('input');
//
//     re_replyTextarea.className = "rereplyInput";
//     re_replySubmit.className = "rereplyInputButton";
//     re_replySubmit.type = "submit";
//     re_replySubmit.value = "submit";
//     re_replySubmit.addEventListener('click', function(){
//         let newRereply = {};
//         newRereply.type = type;
//         newRereply.content = re_replyTextarea.value;
//         newRereply.replyId = reply.id;
//         let ajaxReReplyLi = ajaxReReply(reply, newRereply.content);
//         makeRequest('POST', 'api/rereply/'+ reply.id, newRereply)
//             .then(result => {
//                 const replyLi = document.getElementById("replyLi"+reply.id);
//                 const parsedResult = JSON.parse(result);
//                 re_replyTextarea.value = '';
//                 const tempReReply = document.getElementById(ajaxReReplyLi);
//                 tempReReply.remove();
//                 replyLi.appendChild(createReReply(parsedResult.rereply, parsedResult.userId, parsedResult.type));
//             });
//     });
//     re_replyDiv.appendChild(re_replyTextarea);
//     re_replyDiv.appendChild(re_replySubmit);
//
//     return re_replyDiv;
// }

// function ajaxReReply(reply, content){
//     const replyLi = document.getElementById("replyLi"+reply.id);
//     const re_replyDl = document.createElement('dl');
//     re_replyDl.className = "dlPccAndTac";
//     re_replyDl.id = 'cd';
//     //inside re_replyDl
//     const re_replyDt = document.createElement('dt');
//     re_replyDt.className = "dtPccAndTac";
//     {
//         //inside re_replyDt
//         const re_replyPre = document.createElement('pre');
//         re_replyPre.className = "pccomment-dt";
//         re_replyPre.innerHTML = content;
//         re_replyDt.appendChild(re_replyPre);
//     }
//     re_replyDl.append(re_replyDt);
//     replyLi.appendChild(re_replyDl);
//     return 'cd';
// }

/* ====== Create Re-reply ====== */
// function createReReply(re_reply, userId, type){
//     const re_replyDl = document.createElement('dl');
//     re_replyDl.className = "rereplyDl";
//     //inside re_replyDl
//     const re_replyDt = document.createElement('dt');
//     const re_replyDd = document.createElement('dd');
//
//     re_replyDt.className = "dtPccAndTac";
//     {
//         //inside re_replyDt
//         const re_replyPre = document.createElement('pre');
//         re_replyPre.className = "pccomment-dt";
//         re_replyPre.innerHTML = `${re_reply.content}`;
//
//         if(userId){
//             re_replyDt.appendChild(createMenuButton(userId, 0, re_reply, type, 0));
//         }
//         re_replyDt.appendChild(re_replyPre);
//     }
//     re_replyDd.className = "ddPccAndTac";
//     re_replyDd.innerHTML = 'by ' + `${re_reply.u_id}` + ' / ' + `${re_reply.date}`;
//     re_replyDl.appendChild(re_replyDt);
//     re_replyDl.appendChild(re_replyDd);
//
//     return re_replyDl;
// }
