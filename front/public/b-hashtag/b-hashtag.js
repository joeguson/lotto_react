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
        hashtag.className = "hashtag"
        hashtag.innerText = this.src.map(e => `#${e.hash}`).join(' ');

        this.appendChild(hashtag);
    }
}
customElements.define('b-hashtag', BeritamusHashtag);
