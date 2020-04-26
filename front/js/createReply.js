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
                    createReplyLi(parsedResult.reply, parsedResult.type, parsedResult.userId);
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
        replyDl.className = "dlComAndAns";
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

function ajaxReReply(reply, content){
    const replyLi = document.getElementById("replyLi"+reply.id);
    const re_replyDl = document.createElement('dl');
    re_replyDl.className = "dlPccAndTac";
    re_replyDl.id = 'cd';
    //inside re_replyDl
    const re_replyDt = document.createElement('dt');
    re_replyDt.className = "dtPccAndTac";
    {
        //inside re_replyDt
        const re_replyPre = document.createElement('pre');
        re_replyPre.className = "pccomment-dt";
        re_replyPre.innerHTML = content;
        re_replyDt.appendChild(re_replyPre);
    }
    re_replyDl.append(re_replyDt);
    replyLi.appendChild(re_replyDl);
    return 'cd';
}

/* ====== Create Reply ====== */
function createReplyLi(reply, type, userId, articleAuthor){
    const replyUl = document.getElementById('replyUl');
    {
        // a reply is built in a li tag
        const replyLi = document.createElement('li');
        replyLi.className = "liComAndAns";
        replyLi.id = "replyLi"+reply.id;
        {
            //inside replyLi
            const replyDl = document.createElement('dl');
            {
                replyDl.className="dlComAndAns";
                //inside replyDl
                const replyDt = document.createElement('dt');
                {
                    //inside replyDt
                    const replyPre = document.createElement('pre');
                    replyPre.className = "pcomment-dt";
                    type === 'tandya' ? replyPre.innerHTML = `${reply.answer}` : replyPre.innerHTML = `${reply.content}`;
                    if(userId) replyDt.appendChild(createMenuButton(userId, articleAuthor, reply, type, 1));
                    replyDt.appendChild(replyPre);
                }
                const replyDd = document.createElement('dd');
                {
                    // inside replyDd
                    const replyInfo = document.createElement('span');
                    replyInfo.className = "ddComAndAns";
                    replyInfo.innerHTML = 'by ' + `${reply.u_id}` + ' / ' + `${reply.date}` + ' / ';

                    const replyLikeNum = document.createElement('span');
                    replyLikeNum.className = "comAnsLike";
                    replyLikeNum.id = reply.id;
                    replyLikeNum.innerHTML = reply.likeCount;

                    replyDd.appendChild(replyInfo);
                    replyDd.appendChild(replyLikeNum);

                    // like button for reply
                    if(userId) replyDd.appendChild(createLikeButton(userId, reply, type, replyLikeNum));
                }
                replyDt.className = "dtComAndAns";
                replyDd.className = "ddComAndAns";

                replyDl.appendChild(replyDt);
                replyDl.appendChild(replyDd);
                replyLi.appendChild(replyDl);
            }
            if(userId) replyLi.appendChild(createReReplyInput(reply, type));

            reply.comments.forEach(re_reply => {
                replyLi.appendChild(createReReply(re_reply, userId, type));
            });

            replyUl.appendChild(replyLi);
        }
    }
}

/* ====== Create Re-reply Input ======= */
function createReReplyInput(reply, type){
    const re_replyDiv = document.createElement('div');
    re_replyDiv.className = "pccOrTac";
    //inside re_replyDiv
    const re_replyTextarea = document.createElement('textarea');
    const re_replySubmit = document.createElement('input');

    re_replyTextarea.className = "pccTacInput";
    re_replySubmit.className = "pccTacInputButton";
    re_replySubmit.type = "submit";
    re_replySubmit.value = "submit";
    re_replySubmit.addEventListener('click', function(){
        let newRereply = {};
        newRereply.type = type;
        newRereply.content = re_replyTextarea.value;
        newRereply.replyId = reply.id;
        let ajaxReReplyLi = ajaxReReply(reply, newRereply.content);
        makeRequest('POST', 'api/rereply/'+ reply.id, newRereply)
            .then(result => {
                const replyLi = document.getElementById("replyLi"+reply.id);
                const parsedResult = JSON.parse(result);
                re_replyTextarea.value = '';
                const tempReReply = document.getElementById(ajaxReReplyLi);
                tempReReply.remove();
                replyLi.appendChild(createReReply(parsedResult.rereply, parsedResult.userId, parsedResult.type));
            });
    });
    re_replyDiv.appendChild(re_replyTextarea);
    re_replyDiv.appendChild(re_replySubmit);

    return re_replyDiv;
}

/* ====== Create Re-reply ====== */
function createReReply(re_reply, userId, type){
    const re_replyDl = document.createElement('dl');
    re_replyDl.className = "dlPccAndTac";
    //inside re_replyDl
    const re_replyDt = document.createElement('dt');
    const re_replyDd = document.createElement('dd');

    re_replyDt.className = "dtPccAndTac";
    {
        //inside re_replyDt
        const re_replyPre = document.createElement('pre');
        re_replyPre.className = "pccomment-dt";
        re_replyPre.innerHTML = `${re_reply.content}`;

        if(userId){
            re_replyDt.appendChild(createMenuButton(userId, 0, re_reply, type, 0));
        }
        re_replyDt.appendChild(re_replyPre);
    }
    re_replyDd.className = "ddPccAndTac";
    re_replyDd.innerHTML = 'by ' + `${re_reply.u_id}` + ' / ' + `${re_reply.date}`;
    re_replyDl.appendChild(re_replyDt);
    re_replyDl.appendChild(re_replyDd);

    return re_replyDl;
}

/* ====== Create Reply Like Button ====== */
function createLikeButton(userId, content, type, likeTarget){
    const replyLikeSpan= document.createElement('span');
    replyLikeSpan.className = "comAnsButton";
    const replyLikeButton= document.createElement('button');
    const replyLikeImg= document.createElement('img');
    replyLikeButton.className = "pctalikeButton";
    replyLikeButton.type = "submit";
    replyLikeButton.value = content.id;
    replyLikeButton.onclick = () =>{
        let replyLikeNumOnclick = document.getElementById(content.id);
        if(content.likeStatus){
            replyLikeNumOnclick.innerHTML = parseInt(replyLikeNumOnclick.innerHTML)-1;
            replyLikeImg.src = location.origin +'/icons/cap.png';
        }
        else{
            likeTarget.innerHTML = parseInt(likeTarget.innerHTML)+1;
            replyLikeImg.src = location.origin +'/icons/nocap.png';
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
    replyLikeImg.className = "pctalikeImage";
    (content.likeStatus) ? replyLikeImg.src = location.origin +'/icons/nocap.png' : replyLikeImg.src = location.origin +'/icons/cap.png';

    replyLikeButton.appendChild(replyLikeImg);
    replyLikeSpan.appendChild(replyLikeButton);

    return replyLikeSpan;
}

/* ====== Create Menu Button ====== */
function createMenuButton(userId, articleAuthor, content, type, kind){
    const menuButton = document.createElement('div');
    menuButton.innerHTML = "≡";
    (kind === 1) ? menuButton.className = "caPopButton" : menuButton.className = "pcctacPopButton";
    menuButton.onclick = () => {
        menuButton.childNodes[1].classList.toggle("show");
    };
    const menuPopDiv= document.createElement('div');
    (kind === 1) ? menuPopDiv.className = "caPopDiv" : menuPopDiv.className = "pcctacPopDiv";
    // Create warnButton
    {
        const warnButton = document.createElement('button');
        (kind === 1) ? warnButton.className = "caPopMenu" : warnButton.className = "pcctacPopMenu";
        const warnImg= document.createElement('img');
        warnImg.src = location.origin +'/icons/warn.png';
        warnButton.onclick = () => {
            if(kind === 1){
                if(type==='penobrol') warnPenobrolCom(content.id);
                else if(type==='tandya') warnTandyaAns(content.id);
                else if(type==='youtublog') warnYoutublogCom(content.id);
            }
            else{
                if(type==='penobrol') warnPenobrolComCom(content.id);
                else if(type==='tandya') warnTandyaAnsCom(content.id);
                else if(type==='youtublog') warnYoutublogComCom(content.id);
            }
        };
        warnButton.appendChild(warnImg);
        menuPopDiv.appendChild(warnButton);
    }
    // when author and user is same
    if(userId === content.author){
        // Create delete button
        {
            const deleteButton = document.createElement('button');
            (kind === 1) ? deleteButton.className = "caPopMenu" : deleteButton.className = "pcctacPopMenu";
            const deleteImg= document.createElement('img');
            deleteImg.src = location.origin +'/icons/trash.png';
            deleteButton.onclick = () => {
                if(kind === 1){
                    if(type==='penobrol') deletePenobrolCom(content.id);
                    else if(type==='tandya') deleteTandyaAns(content.id);
                    else if(type==='youtublog') deleteYoutublogCom(content.id);
                }
                else{
                    if(type==='penobrol') deletePenobrolComCom(content.id);
                    else if(type==='tandya') deleteTandyaAnsCom(content.id);
                    else if(type==='youtublog') deleteYoutublogComCom(content.id);
                }
            };
            deleteButton.appendChild(deleteImg);
            menuPopDiv.appendChild(deleteButton);
        }
        // Create edit & chosen button
        if(kind === 1) {
            //edit
            const editA = document.createElement('a');
            editA.className="caPopMenu";
            if(type==='penobrol') editA.href = type+'/edit/comment/'+content.p_id+'/'+content.id;
            else if(type==='tandya') editA.href = type+'/edit/answer/'+content.t_id+'/'+content.id;
            else if(type==='youtublog') editA.href = type+'/edit/comment/'+content.y_id+'/'+content.id;
            const editImg= document.createElement('img');
            editImg.src = location.origin +'/icons/edit.png';
            editA.appendChild(editImg);
            menuPopDiv.appendChild(editA);
        }
    }
    if(userId === articleAuthor && kind === 1){
        //chosen
        const chosenButton = document.createElement('button');
        chosenButton.className = "caPopMenu";
        const chosenImg= document.createElement('img');
        chosenImg.src = location.origin +'/icons/check.png';
        chosenButton.onclick = () => {
            __chooseFunc(type, content.id);
        };
        chosenButton.appendChild(chosenImg);
        menuPopDiv.appendChild(chosenButton);
    }
    menuButton.appendChild(menuPopDiv);
    return menuButton;
}