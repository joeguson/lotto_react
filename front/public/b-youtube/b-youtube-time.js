class BeritamusYoutubeTime extends HTMLElement {
    constructor() {
        super();
        this.div = null;
    }

    connectedCallback() {
        this.__build();
    }

    __build(){
        this.appendChild(this.__getHour());
        this.appendChild(this.__getMinute());
        this.appendChild(this.__getSecond());
        this.appendChild(this.__getDescription());

    }

    __getHour(){
        const h = document.createElement("input");
        h.style.width = "10%";
        return h;
    }

    __getMinute(){
        const m = document.createElement("input");
        m.style.width = "10%";

        return m;
    }

    __getSecond(){
        const s = document.createElement("input");
        s.style.width = "10%";

        return s;
    }

    __getDescription(){
        const d = document.createElement("input");
        d.style.width = "70%";

        return d;
    }
}

customElements.define('b-youtube-time', BeritamusYoutubeTime);
