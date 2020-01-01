class BeritamusThumbnail extends HTMLElement {
    constructor() {
        super();
        this.src = null;
    }

    connectedCallback() {
        this.src = JSON.parse(this.getAttribute("jsonSrc"));
        this.__build();
    }

    __build() {
        const li = document.createElement("li");

        li.appendChild(this.__buildArticle());
        li.appendChild(this.__buildImage());

        const br = document.createElement("br");
        br.className = "clear";
        li.appendChild(br);

        this.appendChild(li);
    }

    __buildArticle() {
        const type = this.src.identifier === 'p'? 'penobrol' : 'tandya';

        const article = document.createElement("dl");
        article.className = "articleDiv";
        article.onclick = () => {
            location.href = `${type}/${this.src.id}`;
        };

        const dt = document.createElement("dt");
        const title = document.createElement("a");
        title.href = `/${type}/${this.src.id}`;
        title.innerText = this.src.identifier === 'p'? this.src.title : this.src.question;
        dt.appendChild(title);
        article.appendChild(dt);

        const content = document.createElement("dd");
        content.className = "ddcontent";
        content.innerText = this.src.thumbnail;
        article.appendChild(content);

        const hashtag = document.createElement("dd");
        hashtag.innerText = this.src.hashtags.map(e => `#${e.hash}`).join(' ');
        article.appendChild(hashtag);

        const date = document.createElement("dd");
        date.innerText = this.src.date + ' / ' + this.src.view + ' views';
        article.appendChild(date);

        return article;
    }

    __buildImage() {
        const image = document.createElement("div");

        if(this.src.img) {
            const img = document.createElement("img");
            img.src = this.src.img;
            image.appendChild(img);
        }

        return image;
    }
}

customElements.define('b-thumbnail', BeritamusThumbnail);
