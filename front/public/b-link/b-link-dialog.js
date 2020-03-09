class BeritamusLinkDialog extends BeritamusDialog {
    constructor() {
        super();
        this.idInput = null;
        this.controlButton = null;
    }

    connectedCallback() {
        this.contentAreaBuilder = () => {
            const input = document.createElement("input");
            input.style.display = "block";
            input.id = "linkInput";
            this.idInput = input;
            return input;
        };

        this.buttonAreaBuilder = () => {
            const button = document.createElement("button");
            button.innerText = 'create link';
            button.id = 'linkButton';
            button.style.display = "block";
            return button;
        };
        super.connectedCallback();
    }
}

customElements.define('b-link-dialog', BeritamusLinkDialog);


