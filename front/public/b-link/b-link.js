class BeritamusLink extends HTMLElement {
    constructor() {
        super();
        this.src = null;
        this.img = null;
    }

    connectedCallback() {
        this.src = JSON.parse(this.getAttribute("jsonSrc"));
        this.__build();
    }

    __build() {
        const ogData = this.src;
        const linkDiv = document.createElement("div");
        linkDiv.className = "linkDiv";
        linkDiv.appendChild(this.__buildImage());
        linkDiv.appendChild(this.__buildTitle());
        linkDiv.appendChild(this.__buildDesc());
        linkDiv.style.textAlign = "center";
        linkDiv.setAttribute("onclick", `window.open('${ogData.url}')`);
        this.appendChild(linkDiv);
    }

    __buildImage() {
        const linkImg = document.createElement('img');
        linkImg.className = "linkImg";
        if(this.src.img){
            linkImg.src = this.src.img;
        }
        return linkImg;
    }

    __buildTitle() {
        const titleDiv = document.createElement('div');
        titleDiv.className = "linkTitle";
        if(this.src.title) {
            titleDiv.innerHTML = this.src.title;
        }
        return titleDiv;
    }

    __buildDesc() {
        const titleDesc = document.createElement('div');
        titleDesc.className = "linkDesc";
        if(this.src.desc) {
            titleDesc.innerHTML = this.src.desc;
        }
        return titleDesc;
    }
}
customElements.define('b-link', BeritamusLink);
