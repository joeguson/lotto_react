class BeritamusLink extends HTMLElement {
    constructor() {
        super();
        this.src = null;
    }

    connectedCallback() {
        this.src = JSON.parse(this.getAttribute("jsonSrc"));
        this.__build();
    }

    __build() {
        const ogData = this.src;
        const linkDiv = document.createElement("div");
        linkDiv.className = "linkDiv";
        if(ogData.img) linkDiv.appendChild(this.__buildImage());
        console.log(ogData);
        const linkContent = document.createElement('div');
        linkContent.className = 'linkContent';
        linkContent.appendChild(this.__buildTitle());
        linkContent.appendChild(this.__buildDesc());

        linkDiv.appendChild(linkContent);
        linkDiv.style.textAlign = "center";
        linkDiv.setAttribute("onclick", `window.open('${ogData.url}')`);
        this.appendChild(linkDiv);
    }

    __buildImage() {
        const linkImg = document.createElement('img');
        linkImg.className = "linkImg";
        linkImg.src = this.src.img;
        return linkImg;
    }

    __buildTitle() {
        const titleDiv = document.createElement('div');
        titleDiv.className = "linkTitle";
        titleDiv.style.backgroundColor = 'white';
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
