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
        this.__iframe.src = "https://www.youtube.com/embed/" + youtubeId + "?";
        super.showModal();
    }

    onConfirm() {
        super.onConfirm();
        if (this.onConfirmCallback) {
            const data = {
                youtubeId: this.__youtubeId,
                times: Array.from(this.getElementsByTagName('b-youtube-time'))
                    .map(e => {
                        return {
                            hour: e.children[0].value,
                            minute: e.children[1].value,
                            second: e.children[2].value,
                            desc: e.children[3].value
                        }
                    })
            };
            this.onConfirmCallback(data);
            Array.from(this.getElementsByTagName('b-youtube-time'))
                .forEach((e) => {
                    e.parentElement.parentElement.removeChild(e.parentElement);
                });
        }
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
