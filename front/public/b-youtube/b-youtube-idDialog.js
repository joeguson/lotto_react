class BeritamusIdDialog extends BeritamusDialog {
    constructor() {
        super();
        this.idInput = null;
        this.controlButton = null;
        this.youtubeDialog = document.createElement("b-youtube-dialog");
    }

    connectedCallback() {
        this.contentAreaBuilder = () => {
            const input = document.createElement("input");
            input.style.display = "block";
            input.id = "videoInput";
            this.idInput = input;
            return input;
        };

        this.buttonAreaBuilder = () => {
            const button = document.createElement("button");
            button.innerText = 'button';
            button.id = 'videoButton';
            button.style.display = "block";
            return button;
        };
        super.connectedCallback();
    }
}

customElements.define('b-youtube-id-dialog', BeritamusIdDialog);
