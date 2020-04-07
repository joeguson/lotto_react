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
        console.log(ogData);
        const linkDiv = document.createElement("div");
        linkDiv.appendChild(this.__buildImage());
        linkDiv.appendChild(this.__buildTitle());
        linkDiv.appendChild(this.__buildDesc());
        linkDiv.style.textAlign = "center";
        linkDiv.setAttribute("onclick", `window.open('${ogData.url}')`);
        //아래의 방법은 왜 안되는지....
        // linkDiv.onclick = () => {
        //     window.open(ogData.url);
        // };
        this.appendChild(linkDiv);
    }

    __buildImage() {
        const linkImg = document.createElement('img');
        if(this.src.img){
            linkImg.src = this.src.img;
            linkImg.style.width = "90%";
            linkImg.style.textAlign = "center";
        }
        return linkImg;
    }

    __buildTitle() {
        const titleDiv = document.createElement('div');
        if(this.src.title) {
            titleDiv.innerHTML = this.src.title;
            titleDiv.style.width = "90%";
        }
        return titleDiv;
    }

    __buildDesc() {
        const titleDesc = document.createElement('div');
        if(this.src.desc) {
            titleDesc.innerHTML = this.src.desc;
            titleDesc.style.width = "90%";
        }
        return titleDesc;
    }
}
customElements.define('b-link', BeritamusLink);
