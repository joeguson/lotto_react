class BeritamusYoutubeTime extends HTMLElement {
    constructor() {
        super();
        this.div = null;
    }

    connectedCallback() {
        this.__build();
    }

    __build(){
        const section = this.div = document.createElement("div");
        section.appendChild(this.__getSection());
        {
            const p = document.createElement("button");
            section.appendChild(p);
        }
        this.appendChild(section);
    }

    __getSection() {
        const div = document.createElement("div");
        div.style.display = "flex";
        div.appendChild(this.__getMinute());
        div.appendChild(this.__getSecond());
        div.appendChild(this.__getDescription());

        return div;
    }

    __getMinute(){
        const m = document.createElement("input");
        m.style.width = "15%";

        return m;
    }

    __getSecond(){
        const s = document.createElement("input");
        s.style.width = "15%";

        return s;
    }

    __getDescription(){
        const d = document.createElement("input");
        d.style.width = "70%";

        return d;
    }
}

customElements.define('b-youtube-time', BeritamusYoutubeTime);
