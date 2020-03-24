class BeritamusLink extends HTMLElement {
    constructor() {
        super();
        this.src = null;
        console.log(this);
        console.log('hi');
    }

    connectedCallback() {
        this.src = JSON.parse(this.getAttribute("jsonSrc"));
        this.__buildLink();
    }

    __buildLink() {
        const ogData = this.src;
        console.log(ogData);
        const linkDiv = document.createElement("div");
        const linkImg = document.createElement('img');
        const linkTitle = document.createElement('div');
        const linkDesc = document.createElement('div');

        linkImg.src = ogData.img;
        linkTitle.innerHTML = ogData.title;
        linkDesc.innerHTML = ogData.desc;
        linkDiv.appendChild(linkImg);
        linkDiv.appendChild(linkTitle);
        linkDiv.appendChild(linkDesc);

        this.appendChild(linkDiv);
    }
}
customElements.define('b-link', BeritamusLink);
