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
                            //버튼을 누르자마자 현재 __like를 기준으로 우선 그림과 숫자를 바꿔줌
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
