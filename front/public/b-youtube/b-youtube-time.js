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
        h.className = 'youtublogTimeInput';
        h.placeholder = 'h';
        return h;
    }

    __getMinute(){
        const m = document.createElement("input");
        m.className = 'youtublogTimeInput';
        m.placeholder = 'm';
        return m;
    }

    __getSecond(){
        const s = document.createElement("input");
        s.className = 'youtublogTimeInput';
        s.placeholder = 's';
        return s;
    }

    __getDescription(){
        const d = document.createElement("input");
        d.className = 'youtublogDescriptionInput';
        d.placeholder = 'description';
        return d;
    }
}

customElements.define('b-youtube-time', BeritamusYoutubeTime);
