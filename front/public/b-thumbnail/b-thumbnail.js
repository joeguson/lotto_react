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
            this.img.onload = () => {
                const src = this.src;
                const img = this.img;
                const div = this.div;
                let diff = 0;

                let imgWidth = img.offsetWidth;
                let imgHeight = img.offsetHeight;

                let frameWidth = div.offsetWidth;
                img.className = this.src.img.rotate;

                if(imgWidth >= imgHeight){
                    //가로로 긴 사진이라면
                    if(src.img.rotate === 'rotate090' || src.img.rotate ==='rotate270'){
                        //세로로 긴 사진이 됨
                        img.style.height = frameWidth + 'px';
                    }
                    else{
                        img.style.width = frameWidth + 'px';
                    }
                }
                else{
                    //세로로 긴 사진이라면
                    if(src.img.rotate === 'rotate090' || src.img.rotate ==='rotate270'){
                        //가로로 긴 사진이 됨
                        img.style.height = frameWidth + 'px';
                    }
                    else{
                        img.style.width = frameWidth + 'px';
                    }
                }

                // if(imgWidth >= imgHeight){
                //     //가로로 긴 사진이라면
                //     if(src.img.rotate === 'rotate090' || src.img.rotate ==='rotate270'){
                //         // 세로로 긴 사진이 됨
                //         img.style.height = '100%'; //양옆 세로에 맞춤
                //         if(img.style.marginTop === '0px' || img.style.marginTop === ''){
                //             diff = Math.abs(frameHeight - img.height)/2;
                //             img.style.marginTop = diff+"px";
                //             img.style.marginBottom = diff+"px";
                //         }
                //         img.style.height = frameWidth + 'px'; //위아래 가로에 맞춤.
                //         img.style.marginTop = ((frameHeight/2)-15)*(-0.5)+"px";
                //     }
                //     else{
                //         //원래의 상태
                //         img.style.width = '100%'; //양옆 세로에 맞춤
                //     }
                // }
                // else{
                //     //세로로 긴 사진이라면
                //     if(src.img.rotate === 'rotate090' || src.img.rotate ==='rotate270'){
                //         //가로로 긴 사진이 됨
                //         img.style.width = frameHeight  + 'px'; //양옆 세로에 맞춤
                //         if(img.style.marginTop === '0px' || img.style.marginTop === ''){
                //             diff = Math.abs(frameHeight - img.height)/2;
                //             img.style.marginTop = diff+"px";
                //             img.style.marginBottom = diff+"px";
                //         }
                //         img.style.height = frameWidth + 'px'; //위아래 가로에 맞춤.
                //         img.style.marginTop = ((frameHeight/2)-15)*(-0.5)+"px";
                //     }
                //     else{
                //         //원래의 상태
                //     }
                // }
                // else{
                //     imgRatio = imgWidth / imgHeight;
                //     img.style.height = frameHeight  + 'px'; //위아래 세로에 맞춤
                //     if(img.style.marginTop === '0px' || img.style.marginTop === ''){
                //         diff = Math.abs(this.dl.offsetHeight - img.height)/2;
                //         img.style.marginTop = diff+"px";
                //         img.style.marginBottom = diff+"px";
                //     }
                //     img.style.width = frameWidth + 'px'; //양옆 가로에 맞춤
                //     if(img.style.marginLeft === '0px' || img.style.marginLeft === ''){
                //         diff = Math.abs(div.offsetWidth - img.width)/2;
                //         img.style.marginLeft = diff+"px";
                //         img.style.marginRight = diff+"px";
                //     }
                // }
            }
        }

    }
    __build() {
        const li = document.createElement("li");
        li.appendChild(this.__buildImage());
        li.appendChild(this.__buildArticle());
        li.className = "thumbnailLi";

        const br = document.createElement("br");
        br.className = "clear";
        li.appendChild(br);
        this.appendChild(li);
    }
    __buildArticle() {
        let type = '';
        if(this.src.identifier === 'p') type = 'penobrol';
        else if(this.src.identifier === 't') type = 'tandya';
        else type = 'youtublog';

        this.dl = document.createElement("dl");
        this.dl.className = "articleDl";
        this.dl.onclick = () => {
            location.href = `${type}`+'/'+`${this.src.id}`;
        };

        const dt = document.createElement("dt");
        const title = document.createElement("a");
        title.href = `${type}`+'/'+`${this.src.id}`;
        title.innerText = this.src.identifier === 't'? this.src.question : this.src.title;
        dt.appendChild(title);
        this.dl.appendChild(dt);

        const content = document.createElement("dd");
        content.className = "ddcontent";
        content.innerText = this.src.thumbnail;
        this.dl.appendChild(content);

        const hashtag = document.createElement("b-hashtag");
        hashtag.className = "hashtag";
        hashtag.setAttribute("jsonSrc", JSON.stringify(this.src.hashtags));
        this.dl.appendChild(hashtag);

        const date = document.createElement("dd");
        date.innerText = this.src.identifier === 't'? this.src.answerCount + ' answers': this.src.commentCount +' comments';
        date.innerText = date.innerText +  ' / ' + this.src.date + ' / ' + this.src.view + ' views / ' +this.src.likeCount + ' likes';
        this.dl.appendChild(date);

        return this.dl;
    }

    __buildImage() {
        this.div = document.createElement("div");
        this.div.className = "articleImage";
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
