class BeritamusYoutubeDialog extends BeritamusDialog {
    constructor() {
        super();
        this.content = null;
        this.control = null;
        this.iframe = null;
    }

    connectedCallback() {
        this.contentAreaBuilder = () => {
            const div = document.createElement("div");
            {
                this.iframe = document.createElement("iframe");
                this.iframe.width = "560";
                this.iframe.height = "315";
                this.iframe.frameBorder = "0";
                // iframe.allowFullscreen = true;
                div.appendChild(this.iframe);
            }
            {
                const times = document.createElement("div");
                const p = document.createElement("button");
                times.appendChild(p);
                p.innerText = "+";
                p.onclick = () => {
                    const c = this.__newYoutubeTimeDescriptionCard((card) => {
                        times.removeChild(c);
                    });
                    times.insertBefore(c, p);
                };
                div.appendChild(times);
            }
            return div;
        };

        this.buttonAreaBuilder = () => {
            const confirm = document.createElement("button");
            confirm.innerText = "confirm";

            confirm.onclick = () => {
                this.youtubeDialog.iframe.style.width = "100%";
                const youtubeHTML = this.youtubeDialog.iframe.outerHTML;
                this.youtubeDialog.close();
                this.youtubeIdDialog.close();
                this.editor.body.focus();
                this.editor.execCommand("insertHTML", false, youtubeHTML);
            };
            return confirm;
        };
        super.connectedCallback();
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
        b.onclick = () => { minusCallback(c);};
        c.appendChild(b);

        return c;
    }
}

customElements.define('b-youtube-dialog', BeritamusYoutubeDialog);
