function makeRequest(method, url, data) {
    return new Promise(function (resolve, reject) {
        let original = JSON.stringify(data);
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.setRequestHeader('Content-type', "application/json");
        xhr.send(original);
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
    });
}

function createReplyLi(reply, type, userId){
    console.log(reply);;
    const replyUl = document.getElementById('replyUl');
    {
        const replyLi = document.createElement('li');
        replyLi.className = "liComAndAns";
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
                    if(type==='tandya') replyPre.innerHTML = `${reply.answer}`;
                    else replyPre.innerHTML = `${reply.content}`;

                    if(userId){
                        const replyPopButton= document.createElement('div');
                        replyPopButton.innerHTML = "≡";
                        replyPopButton.className = "caPopButton";
                        replyPopButton.onclick = () =>{
                            replyPopButton.childNodes[1].classList.toggle("show");
                        };
                        const replyPopDiv= document.createElement('div');
                        {
                            replyPopDiv.className = "caPopDiv";
                            {
                                const replyWarnButton = document.createElement('button');
                                replyWarnButton.className="caPopMenu";
                                const replyWarnImg= document.createElement('img');
                                replyWarnImg.src = location.origin +'/icons/warn.png';
                                replyWarnButton.onclick = () => {
                                    if(type==='penobrol') warnPenobrolCom(reply.id);
                                    else if(type==='tandya') warnTandyaAns(reply.id);
                                    else if(type==='youtublog') warnYoutublogCom(reply.id);
                                };
                                replyWarnButton.appendChild(replyWarnImg);
                                replyPopDiv.appendChild(replyWarnButton);
                            }
                        }
                        replyPopButton.appendChild(replyPopDiv);
                        replyDt.appendChild(replyPopButton);
                    }
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
                    if(userId){
                        const replyLikeSpan= document.createElement('span');
                        replyLikeSpan.className = "comAnsButton";
                        const replyLikeButton= document.createElement('button');
                        const replyLikeImg= document.createElement('img');
                        replyLikeButton.className = "pctalikeButton";
                        replyLikeButton.type = "submit";
                        replyLikeButton.value = reply.id;
                        replyLikeButton.onclick = () =>{
                            let replyLikeNumOnclick = document.getElementById(reply.id);
                            if(reply.likeStatus){
                                replyLikeNumOnclick.innerHTML = parseInt(replyLikeNumOnclick.innerHTML)-1;
                                replyLikeImg.src = location.origin +'/icons/cap.png';
                            }
                            else{
                                replyLikeNum.innerHTML = parseInt(replyLikeNum.innerHTML)+1;
                                replyLikeImg.src = location.origin +'/icons/nocap.png';
                            }
                            //이후에 ajax 요청을 보냄
                            let data = {
                                "id": reply.id,
                                "cancel": reply.likeStatus
                            };
                            reply.likeStatus = !reply.likeStatus;
                            makeRequest('POST', 'api/article/' + type + '/reply/like', data)
                                .then(function (e) {
                                    e = JSON.parse(e);
                                    console.log(e);
                                });
                        };
                        replyLikeImg.className = "pctalikeImage";
                        if(reply.likeStatus) replyLikeImg.src = location.origin +'/icons/nocap.png';
                        else replyLikeImg.src = location.origin +'/icons/cap.png';

                        replyLikeButton.appendChild(replyLikeImg);
                        replyLikeSpan.appendChild(replyLikeButton);
                        replyDd.appendChild(replyLikeSpan);
                    }
                }
                replyDt.className = "dtComAndAns";
                replyDd.className = "ddComAndAns";

                replyDl.appendChild(replyDt);
                replyDl.appendChild(replyDd);
                replyLi.appendChild(replyDl);
            }

            const re_replyDiv = document.createElement('div');
            {
                re_replyDiv.className = "pccOrTac";
                //inside re_replyDiv
                const re_replyTextarea = document.createElement('textarea');
                const re_replySubmit = document.createElement('input');

                re_replyTextarea.className = "pccTacInput";
                re_replySubmit.className = "pccTacInputButton";

                re_replyDiv.appendChild(re_replyTextarea);
                re_replyDiv.appendChild(re_replySubmit);

                replyLi.appendChild(re_replyDiv);
            }

            reply.comments.forEach(re_reply => {
                const re_replyDl = document.createElement('dl');
                {
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
                            const re_replyPopButton= document.createElement('div');
                            re_replyPopButton.innerHTML = "≡";
                            re_replyPopButton.className = "pcctacPopButton";
                            re_replyPopButton.onclick = () =>{
                                re_replyPopButton.childNodes[1].classList.toggle("show");
                            };
                            const re_replyPopDiv= document.createElement('div');
                            {
                                re_replyPopDiv.className = "pcctacPopDiv";
                                {
                                    const re_replyWarnButton = document.createElement('button');
                                    re_replyWarnButton.className="caPopMenu";
                                    const re_replyWarnImg= document.createElement('img');
                                    re_replyWarnImg.src = location.origin +'/icons/warn.png';
                                    re_replyWarnButton.onclick = () => {
                                        if(type==='penobrol') warnPenobrolComCom(re_reply.id);
                                        else if(type==='tandya') warnTandyaAnsCom(re_reply.id);
                                        else if(type==='youtublog') warnYoutublogComCom(re_reply.id);
                                    };
                                    re_replyWarnButton.appendChild(re_replyWarnImg);
                                    re_replyPopDiv.appendChild(re_replyWarnButton);
                                }
                            }
                            re_replyPopButton.appendChild(re_replyPopDiv);
                            re_replyDt.appendChild(re_replyPopButton);
                        }

                        re_replyDt.appendChild(re_replyPre);
                    }
                    re_replyDd.className = "ddPccAndTac";
                    re_replyDd.innerHTML = 'by ' + `${re_reply.u_id}` + ' / ' + `${re_reply.date}`;
                    re_replyDl.appendChild(re_replyDt);
                    re_replyDl.appendChild(re_replyDd);
                }
                replyLi.appendChild(re_replyDl);
            });

            replyUl.appendChild(replyLi);
        }
    }
}
