class BeritamusLinkDialog extends BeritamusDialog {
    constructor() {
        super();
        this.idInput = null;
        this.controlButton = null;
        this.onConfirmCallback = null;
    }

    connectedCallback() {
        this.contentAreaBuilder = () => {
            const input = document.createElement("input");
            input.className = "dialogInput";
            input.id = "videoInput";
            this.idInput = input;
            return input;
        };
        super.connectedCallback();
    }
    onConfirm() {
        if(this.onConfirmCallback){
            this.onConfirmCallback(this.idInput.value);
        }
        this.idInput.value = '';
        super.onConfirm();
    }
}

customElements.define('b-link-dialog', BeritamusLinkDialog);


