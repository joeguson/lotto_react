class BeritamusYoutubeDialog extends HTMLElement {
    constructor() {
        super();
        this.youtubeDialog = null;
        this.src = null;
    }

    connectedCallback() {
        const width = this.getAttribute("width");
        const height = this.getAttribute("height");
        this.__build(width, height);
        this.src = JSON.parse(this.getAttribute("jsonSrc"));
    }

    __build(w, h){
        console.log(this.src);
        this.youtubeDialog = this.buildYoutubeDialog(w, h);
        this.youtubeDialog.iframe.src = "https://www.youtube.com/embed/" + this.src.address + "?start=1";
        this.youtubeDialog.showModal();
        this.appendChild(this.youtubeDialog);
    }

    buildYoutubeDialog(w, h) {
        const dialog = document.createElement("dialog");
        dialog.style.margin = "auto";
        const div = document.createElement("div");
        {
            const iframe = document.createElement("iframe");
            iframe.width = "560";
            iframe.height = "315";
            iframe.frameBorder = "0";
            // iframe.allowFullscreen = true;
            div.appendChild(iframe);
            dialog.iframe = iframe;

            const times = document.createElement("div");
            {
                const p = document.createElement("button");
                times.appendChild(p);
                p.innerText = "+";
                p.onclick = () => {
                    const c = this.__newYoutubeTimeDescriptionCard((card) => {
                        times.removeChild(c);
                    });
                    times.insertBefore(c, p);
                }
            }
            div.appendChild(times);

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
            div.appendChild(confirm);
        }
        dialog.appendChild(div);
        return dialog;
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
