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

                let imgWidth = img.offsetWidth;
                let imgHeight = img.offsetHeight;

                let frameWidth = div.offsetWidth;
                img.className = this.src.img.rotate;

                if(imgWidth >= imgHeight){
                    //가로로 긴 사진이라면
                    img.style.width = frameWidth + 'px';
                }
                else{
                    //세로로 긴 사진이라면
                    img.style.width = frameWidth + 'px';
                }
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
