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

function createReplyLi(reply, type){
    const replyUl = document.getElementById('replyUl');
    console.log(reply);
    console.log(type);
    {
        const replyLi = document.createElement('li');
        replyLi.className = "liComAndAns";
        replyLi.id = `${reply.id}`;
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
                replyDt.className = "dtComAndAns";
                replyDd.className = "ddComAndAns";

                //아래에서 like는 현재 전체로 가지고 오고 있음. length가 아닌 몇개인지 count로 가지고 와야함
                replyDd.innerHTML = 'by ' + `${reply.u_id}` + ' / ' + `${reply.date}` + ' / ' + `${reply.likes}`;

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
