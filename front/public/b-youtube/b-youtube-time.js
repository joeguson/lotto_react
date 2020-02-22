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
            p.innerText = "+";
            p.onclick = () => {
                const c = this.__getSection(() => {
                    section.removeChild(c);
                });
                section.insertBefore(c, p);
            }
        }
        this.appendChild(section);
    }

    __getSection(minusCallback) {
        const div = document.createElement("div");
        div.style.display = "flex";
        div.appendChild(this.__getMinute());
        div.appendChild(this.__getSecond());
        div.appendChild(this.__getDescription());

        const b = document.createElement("button");
        b.innerText = "-";
        b.onclick = () => { minusCallback(div); };
        div.appendChild(b);

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
