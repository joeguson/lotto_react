class BeritamusHashtag extends HTMLElement {
    constructor() {
        super();
        this.src = null;
    }

    connectedCallback() {
        this.src = JSON.parse(this.getAttribute("jsonSrc"));
        this.__buildHashtag();
    }

    __buildHashtag() {
        const hashtag = document.createElement("dd");
        hashtag.className = "hashtag";
        this.src.forEach((hash) => {
            const temp = document.createElement('span');
            temp.innerHTML = '#'+hash.hash+'  ';
            temp.style.backgroundColor = "#f4f5f0";
            hashtag.appendChild(temp);
        });
        this.appendChild(hashtag);
    }
}
customElements.define('b-hashtag', BeritamusHashtag);
