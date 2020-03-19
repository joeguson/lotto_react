class BeritamusYoutubeDialog extends BeritamusDialog {
    constructor() {
        super();
        this.__iframe = null;
        this.onConfirmCallback = null;
        this.__youtubeId = null;
    }

    connectedCallback() {
        this.contentAreaBuilder = () => {
            const div = document.createElement("div");
            {
                this.__iframe = document.createElement("iframe");
                this.__iframe.width = "560";
                this.__iframe.height = "315";
                this.__iframe.frameBorder = "0";
                // iframe.allowFullscreen = true;
                div.appendChild(this.__iframe);
            }
            {
                const times = document.createElement("div");
                times.id = 'timeTags';
                const p = document.createElement("button");
                times.appendChild(p);
                p.innerText = "+";
                p.onclick = () => {
                    const c = this.__newYoutubeTimeDescriptionCard((card) => {
                        times.removeChild(card);
                    });
                    times.insertBefore(c, p);
                };
                div.appendChild(times);
            }
            return div;
        };

        super.connectedCallback();

    }

    showModal(youtubeId) {
        this.__youtubeId = youtubeId;
        this.__iframe.src = this.__sourceUrl(youtubeId);
        super.showModal();
    }

    onConfirm() {
        super.onConfirm();

        // TODO Open progress dialog

        const source = this.__sourceUrl(this.__youtubeId);
        makeRequest('POST', '/api/youtube', {source: source})
            .then((res) => {
                const id = JSON.parse(res.toString()).id;
                // TODO Request post time rows
                if (this.onConfirmCallback) {
                    this.onConfirmCallback(id);
                }
            })
            .catch((e) => {
                console.error(e);
                // TODO Close progress dialog
            });

        Array.from(this.getElementsByTagName('b-youtube-time'))
            .forEach((e) => {
                e.parentElement.parentElement.removeChild(e.parentElement);
            });

    }

    __sourceUrl(source) {
        return "https://www.youtube.com/embed/" + source + "?"
    }

    __newYoutubeTimeDescriptionCard(minusCallback) {
        const c = document.createElement("div");
        c.style.display = "flex";
        const d = document.createElement("b-youtube-time");
        d.style.width = "95%";
        c.appendChild(d);
        const b = document.createElement("button");
        b.style.width = "5%";
        b.innerText = "-";
        b.onclick = () => {
            minusCallback(c);
        };
        c.appendChild(b);

        return c;
    }

}

customElements.define('b-youtube-dialog', BeritamusYoutubeDialog);
