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
                const img = this.img;
                const div = this.div;

                let imgWidth = img.offsetWidth;
                let imgHeight = img.offsetHeight;

                let frameWidth = div.offsetWidth;
                let frameHeight = (frameWidth * 3) /4;

                if(imgWidth > imgHeight){ //가로로 긴 사진이라면
                    img.style.width = frameWidth + 'px';
                }
                else{ //세로로 길거나 정사각형의 사진
                    img.style.height = frameHeight + 'px';
                }
            }
        }
    }
    __build() {
        let type = '';
        if(this.src.identifier === 'p') type = 'penobrol';
        else if(this.src.identifier === 't') type = 'tandya';
        else type = 'youtublog';

        const li = document.createElement("li");
        if(this.src.img) li.appendChild(this.__buildImage()); //if img exists
        li.appendChild(this.__buildLike());
        li.appendChild(this.__buildArticle(type));
        li.className = "thumbnailLi";

        const br = document.createElement("br");
        br.className = "clear";
        li.appendChild(br);
        li.onclick = () => {
            location.href = `${type}`+'/'+`${this.src.id}`;
        };
        this.appendChild(li);
    }

    __buildImage() {
        this.div = document.createElement("div");
        this.div.className = "thumbnailImg";
        this.img = document.createElement("img");
        this.img.src = this.src.img.src;
        this.div.appendChild(this.img);
        return this.div;
    }

    __buildLike() {
        const likeDiv = document.createElement("div");
        const likeImg = document.createElement("img");
        likeDiv.className = "thumbnailLikeDiv";
        likeImg.className = "thumbnailLikeImg";
        likeImg.src = this.src.likeCount ? 'icons/highlight_ed.png' : 'icons/highlight.png';
        likeImg.style.height = '16px';
        likeDiv.innerText = this.src.likeCount < 2 ? this.src.likeCount + ' highlight  ' : this.src.likeCount + ' highlights  ';
        likeDiv.appendChild(likeImg);
        return likeDiv;
    }

    __buildArticle(type) {
        this.dl = document.createElement("dl");
        this.dl.className = "thumbnailDl";
        this.dl.onclick = () => {
            location.href = `${type}`+'/'+`${this.src.id}`;
        };

        const dt = document.createElement("dt");
        dt.className = "thumbnailDt";
        const title = document.createElement("a");
        title.href = `${type}`+'/'+`${this.src.id}`;
        title.innerText = this.src.identifier === 't'? this.src.question : this.src.title;
        dt.appendChild(title);
        this.dl.appendChild(dt);

        if(this.src.thumbnail){
            const thumbnail = document.createElement("dd");
            thumbnail.className = "ddthumbnail";
            thumbnail.innerText = this.src.thumbnail;
            this.dl.appendChild(thumbnail);
        }

        if(this.src.hashtags){
            const hashtag = document.createElement("b-hashtag");
            hashtag.className = "hashtag";
            hashtag.setAttribute("jsonSrc", JSON.stringify(this.src.hashtags));
            this.dl.appendChild(hashtag);
        }

        const date = document.createElement("dd");
        date.className = "dddate";
        date.innerText = this.src.identifier === 't'? this.src.replyCount + ' answers': this.src.replyCount +' comments';
        date.innerText = date.innerText +  ' | ' + this.src.date + ' | ' + this.src.view + ' views';
        this.dl.appendChild(date);

        return this.dl;
    }
}

customElements.define('b-thumbnail', BeritamusThumbnail);
