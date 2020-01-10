class BeritamusThumbnail extends HTMLElement {
    constructor() {
        super();
        this.src = null;
        this.dl = null;
        this.img = null;
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
                this.img.style.height = this.dl.offsetHeight + 'px';
            };
        }
        // if(this.img){
        //     this.img.onload = function(){
        //         console.log(this);
        //         console.log(this.img.height);
        //     };
        // }
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
            location.href = `${type}/${this.src.id}`;
        };

        const dt = document.createElement("dt");
        const title = document.createElement("a");
        title.href = `/${type}/${this.src.id}`;
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
        date.innerText = this.src.date + ' / ' + this.src.view + ' views';
        this.dl.appendChild(date);

        return this.dl;
    }

    __buildImage() {
        const image = document.createElement("div");
        image.className = "articleImage"
        if(this.src.img) {
            this.img = document.createElement("img");
            this.img.src = this.src.img.src;
            image.appendChild(this.img);
        }
        return image;
    }
}

customElements.define('b-thumbnail', BeritamusThumbnail);
