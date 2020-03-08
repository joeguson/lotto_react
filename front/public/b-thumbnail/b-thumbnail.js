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

                //set frame size
                div.style.height = this.dl.offsetHeight + 'px';

                //get frame's width, height and ratio
                let frameWidth = div.offsetWidth;
                let frameHeight = div.offsetHeight;
                let frameRatio = frameWidth / frameHeight;

                //get img's width, height and ratio
                //img ratio can be altered due to rotation
                let imgWidth = img.offsetWidth;
                let imgHeight = img.offsetHeight;
                let imgRatio;

                if(src.img.rotate === 'rotate090' || src.img.rotate ==='rotate270'){
                    imgRatio = imgHeight / imgWidth;
                    if(frameRatio > imgRatio){
                        img.style.width = frameHeight  + 'px'; //양옆 세로에 맞춤
                        if(img.style.marginTop === '0px' || img.style.marginTop === ''){
                            diff = Math.abs(frameHeight - img.height)/2;
                            img.style.marginTop = diff+"px";
                            img.style.marginBottom = diff+"px";
                        }
                    }
                    else{
                        img.style.height = frameWidth + 'px'; //위아래 가로에 맞춤.
                        img.style.marginTop = ((frameHeight/2)-15)*(-0.5)+"px";
                    }
                }
                else{
                    imgRatio = imgWidth / imgHeight;
                    if(frameRatio > imgRatio){
                        img.style.height = frameHeight  + 'px'; //위아래 세로에 맞춤
                        if(img.style.marginTop === '0px' || img.style.marginTop === ''){
                            diff = Math.abs(this.dl.offsetHeight - img.height)/2;
                            img.style.marginTop = diff+"px";
                            img.style.marginBottom = diff+"px";
                        }
                    }
                    else{
                        img.style.width = frameWidth + 'px'; //양옆 가로에 맞춤
                        if(img.style.marginLeft === '0px' || img.style.marginLeft === ''){
                            diff = Math.abs(div.offsetWidth - img.width)/2;
                            img.style.marginLeft = diff+"px";
                            img.style.marginRight = diff+"px";
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
