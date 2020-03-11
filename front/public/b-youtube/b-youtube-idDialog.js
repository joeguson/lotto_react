class BeritamusIdDialog extends BeritamusDialog {
    constructor() {
        super();
        this.idInput = null;
        this.controlButton = null;
        this.youtubeDialog = document.createElement("b-youtube-dialog");
        this.onConfirmCallback = null;
    }

    connectedCallback() {
        this.contentAreaBuilder = () => {
            const input = document.createElement("input");
            input.style.display = "block";
            input.id = "videoInput";
            this.idInput = input;
            return input;
        };
        super.connectedCallback();
    }

    onConfirm() {
        if(this.onConfirmCallback){
            this.onConfirmCallback((this.idInput.value).split('=')[1]);
        }
        this.idInput.value = '';
        super.onConfirm();
    }
}

customElements.define('b-youtube-id-dialog', BeritamusIdDialog);
