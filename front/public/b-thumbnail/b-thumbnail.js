class BeritamusThumbnail extends HTMLElement {
    constructor() {
        super();
        this.src = null;
        this.dl = null;
        this.img = null;
        this.div = null;
    }

    connectedCallback() {
        this.src = JSON.parse(this.getAttribute("jsonSrc"));
        this.__build();
        this.__start();
    }
    __start(){
        if(this.img){
            // this.dl.onload = () => {
            //     console.log(this.dl.offsetHeight);
            // };
            this.img.onload = () => {
                const src = this.src;
                const img = this.img;
                const div = this.div;
                let diff = 0;
                //check div's height and width
                div.style.height = this.dl.offsetHeight + 'px';
                if(this.dl.offsetHeight < div.offsetWidth){// 틀이 가로형태
                    if(img.width > img.height){// 그림이 가로
                        if(src.img.rotate == 'rotate090' || src.img.rotate =='rotate270'){ // 그림이 세로가 됨
                            img.style.width = this.dl.offsetHeight+'px';
                            if(img.style.marginTop === '0px' || img.style.marginTop === ''){
                                diff = Math.abs(this.dl.offsetHeight - img.height)/2;
                                img.style.marginTop = diff+"px";
                                img.style.marginBottom = diff+"px";
                            }
                            else{
                                img.style.marginTop = '0px';
                                img.style.marginBottom = '0px';
                            }
                        }
                        else{
                            (div.offsetWidth / this.dl.offsetHeight) > (img.width / img.height) ? img.style.height = this.dl.offsetHeight+'px' : img.style.width = div.offsetWidth+'px';
                        }
                    }
                    else if(img.height === img.width){// 그림이 정사각
                        img.style.height = this.dl.offsetHeight+'px';
                        if(img.style.marginLeft === '0px' || img.style.marginLeft === ''){
                            diff = Math.abs(div.offsetWidth - img.width)/2;
                            img.style.marginLeft = diff+"px";
                            img.style.marginRight = diff+"px";
                        }
                        else{
                            img.style.marginLeft = '0px';
                            img.style.marginRight = '0px';
                        }
                    }
                    else{// 그림이 세로
                        if(src.img.rotate == 'rotate090' || src.img.rotate =='rotate270'){// 그림이 가로가 됨
                            (div.offsetWidth / this.dl.offsetHeight) > (img.height / img.width) ? img.style.height = this.dl.offsetHeight+'px' : img.style.width = div.offsetWidth+'px';
                        }
                        else{
                            img.style.height = this.dl.offsetHeight+'px';
                        }
                    }
                }
                else if(this.dl.offsetHeight === div.offsetWidth){ // 틀이 정사각형
                    if(img.width > img.height){// 그림이 가로
                        img.style.width = div.offsetWidth+'px';
                        if(img.style.marginTop === '0px' || img.style.marginTop === ''){
                            diff = Math.abs(this.dl.offsetHeight - img.height)/2;
                            img.style.marginTop = diff+"px";
                            img.style.marginBottom = diff+"px";
                        }
                        else{
                            img.style.marginTop = '0px';
                            img.style.marginBottom = '0px';
                        }
                    }
                    else if(img.height === img.width){// 그림이 정사각
                        img.style.width = div.offsetWidth+'px';
                    }
                    else{// 그림이 세로
                        img.style.height = div.offsetWidth+'px';
                        if(img.style.marginLeft === '0px' || img.style.marginLeft === ''){
                            diff = Math.abs(div.offsetWidth - img.width)/2;
                            img.style.marginLeft = diff+"px";
                            img.style.marginRight = diff+"px";
                        }
                        else{
                            img.style.marginLeft = '0px';
                            img.style.marginRight = '0px';
                        }
                    }
                }
                else{ // 틀이 세로형태
                    if(img.width > img.height){// 그림이 가로
                        if(src.img.rotate == 'rotate090' || src.img.rotate =='rotate270'){ // 그림이 세로가 됨
                            if(img.style.marginTop === '0px' || img.style.marginTop === ''){
                                diff = Math.abs(this.dl.offsetHeight - img.height)/2;
                                img.style.marginTop = diff+"px";
                                img.style.marginBottom = diff+"px";
                            }
                            else{
                                img.style.marginTop = '0px';
                                img.style.marginBottom = '0px';
                            }
                        }
                        else{
                            img.style.width = div.offsetWidth+'px';
                            if(img.style.marginTop === '0px' || img.style.marginTop === ''){
                                diff = Math.abs(this.dl.offsetHeight - img.height)/2;
                                img.style.marginTop = diff+"px";
                                img.style.marginBottom = diff+"px";
                            }
                            else{
                                img.style.marginTop = '0px';
                                img.style.marginBottom = '0px';
                            }
                        }
                    }
                    else if(img.height === img.width){// 그림이 정사각
                        img.style.width = div.offsetWidth+'px';
                        if(img.style.marginTop === '0px' || img.style.marginTop === ''){
                            diff = Math.abs(this.dl.offsetHeight - img.height)/2;
                            img.style.marginTop = diff+"px";
                            img.style.marginBottom = diff+"px";
                        }
                        else{
                            img.style.marginTop = '0px';
                            img.style.marginBottom = '0px';
                        }
                    }
                    else{// 그림이 세로
                        if(src.img.rotate == 'rotate090' || src.img.rotate =='rotate270'){// 그림이 가로가 됨
                            img.style.height = div.offsetWidth+'px';
                            if(img.style.marginTop === '0px' || img.style.marginTop === ''){
                                diff = Math.abs(this.dl.offsetHeight - img.height)/2;
                                img.style.marginTop = diff+"px";
                                img.style.marginBottom = diff+"px";
                            }
                            else{
                                img.style.marginTop = '0px';
                                img.style.marginBottom = '0px';
                            }
                        }
                        else{
                            (div.offsetWidth / this.dl.offsetHeight) > (img.width / img.height) ? img.style.height = this.dl.offsetHeight+'px' : img.style.width = div.offsetWidth+'px';
                        }
                    }
                }
                img.className = this.src.img.rotate;
            }
        }

    }
    __build() {
        const li = document.createElement("li");
        li.appendChild(this.__buildArticle());
        li.appendChild(this.__buildImage());
        li.className = "thumbnailLi"

        const br = document.createElement("br");
        br.className = "clear";
        li.appendChild(br);
        this.appendChild(li);
    }
    __buildArticle() {
        const type = this.src.identifier === 'p'? 'penobrol' : 'tandya';
        this.dl = document.createElement("dl");
        this.dl.className = "articleDl";
        this.dl.onclick = () => {
            location.href = `${type}`+'/view/'+`${this.src.id}`;
        };

        const dt = document.createElement("dt");
        const title = document.createElement("a");
        title.href = `${type}`+'/view/'+`${this.src.id}`;
        title.innerText = this.src.identifier === 'p'? this.src.title : this.src.question;
        dt.appendChild(title);
        this.dl.appendChild(dt);

        const content = document.createElement("dd");
        content.className = "ddcontent";
        content.innerText = this.src.thumbnail;
        this.dl.appendChild(content);

        const hashtag = document.createElement("b-hashtag");
        hashtag.className = "hashtag"
        hashtag.setAttribute("jsonSrc", JSON.stringify(this.src.hashtags));
        this.dl.appendChild(hashtag);

        const date = document.createElement("dd");
        date.innerText = this.src.identifier === 'p'? this.src.commentCount +' comments': this.src.answerCount + ' answers';
        date.innerText = date.innerText +  ' / ' + this.src.date + ' / ' + this.src.view + ' views';
        this.dl.appendChild(date);

        return this.dl;
    }

    __buildImage() {
        this.div = document.createElement("div");
        this.div.className = "articleImage"
        if(this.src.img) {
            this.img = document.createElement("img");
            this.img.src = this.src.img.src;
            // this.img.className = this.src.img.rotate;
            this.div.appendChild(this.img);
        }
        return this.div;
    }
}

customElements.define('b-thumbnail', BeritamusThumbnail);
